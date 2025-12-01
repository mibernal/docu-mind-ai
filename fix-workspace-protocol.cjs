// fix-workspace-protocol.js
// Run from project root: node fix-workspace-protocol.js

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file,'utf8')); }
  catch(e){ return null; }
}

function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function findPackagesDirs() {
  const candidates = ['packages', 'apps'];
  const map = {}; // name -> absolute path
  for (const c of candidates) {
    const dir = path.join(ROOT, c);
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir)) {
      const pkgDir = path.join(dir, entry);
      const pj = path.join(pkgDir, 'package.json');
      if (fs.existsSync(pj)) {
        const pjObj = readJSON(pj);
        if (pjObj && pjObj.name) {
          map[pjObj.name] = pkgDir;
          // also map by folder name as fallback
          map[entry] = pkgDir;
        }
      }
    }
  }
  return map;
}

function walkAndFix(dir, pkgMap) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    if (it.name === 'node_modules' || it.name === '.git') continue;
    const p = path.join(dir, it.name);
    if (it.isDirectory()) walkAndFix(p, pkgMap);
    else if (it.isFile() && it.name === 'package.json') {
      const pjPath = p;
      const pj = readJSON(pjPath);
      if (!pj) { console.log('JSON parse failed for', pjPath); continue; }
      let changed = false;
      const sections = ['dependencies','devDependencies','peerDependencies','optionalDependencies'];
      for (const s of sections) {
        if (!pj[s]) continue;
        for (const dep of Object.keys(pj[s])) {
          const val = pj[s][dep];
          if (typeof val === 'string' && val.startsWith('workspace:')) {
            // try to find package path
            const target = pkgMap[dep];
            if (target) {
              // compute relative path from pjPath's folder
              const rel = path.relative(path.dirname(pjPath), target).split(path.sep).join('/');
              const replacement = `file:${rel}`;
              pj[s][dep] = replacement;
              changed = true;
              console.log(`Replaced ${dep}@${val} -> ${replacement} in ${pjPath}`);
            } else {
              // fallback: change to file:../.. (best-effort)
              pj[s][dep] = val.replace(/^workspace:/, 'file:');
              changed = true;
              console.log(`Fallback replaced ${dep}@${val} -> ${pj[s][dep]} in ${pjPath}`);
            }
          }
        }
      }
      if (changed) writeJSON(pjPath, pj);
    }
  }
}

(function main(){
  console.log('Scanning repo for local packages (packages/* and apps/*)...');
  const pkgMap = findPackagesDirs();
  console.log('Found packages:', Object.keys(pkgMap).join(', '));
  console.log('Walking tree and fixing workspace:* usages...');
  walkAndFix(ROOT, pkgMap);
  console.log('Done. Please review changes and run: npm cache clean --force && npm install');
})();
