// scripts/check_dump_restore.js
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbFile = path.resolve(process.cwd(), 'apps/api/src/prisma/dev.db');
const backup = dbFile + '.bak';
console.log('DB path:', dbFile);

try {
  fs.copyFileSync(dbFile, backup);
  console.log('Backup created:', backup);
} catch (e) {
  console.error('Backup failed:', e.message);
  process.exit(1);
}

try {
  const db = new Database(dbFile, { readonly: true });
  const row = db.prepare('PRAGMA integrity_check;').get();
  console.log('PRAGMA integrity_check =>', row);
  db.close();
} catch (err) {
  console.error('Integrity check failed:', err.message);
  // attempt dump (best-effort)
  try {
    const db2 = new Database(dbFile);
    const dump = [];
    const stmt = db2.prepare("SELECT type, name, sql FROM sqlite_master WHERE sql IS NOT NULL AND type='table'");
    for (const r of stmt.iterate()) {
      dump.push(`-- table: ${r.name}`);
      if (r.sql) dump.push(r.sql + ';');
    }
    // read table data for simple copies (best-effort)
    // WARNING: this is a simplistic dump (not full .dump replacement)
    const tables = db2.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
    for (const t of tables) {
      const rows = db2.prepare(`SELECT * FROM "${t.name}"`).all();
      for (const row of rows) {
        const cols = Object.keys(row).map(c => `"${c}"`).join(', ');
        const vals = Object.values(row).map(v => v === null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`).join(', ');
        dump.push(`INSERT INTO "${t.name}" (${cols}) VALUES (${vals});`);
      }
    }
    fs.writeFileSync(path.resolve(process.cwd(), 'apps/api/src/prisma/dump.sql'), dump.join('\n'));
    console.log('Dump attempted to apps/api/src/prisma/dump.sql (best-effort)');
    db2.close();
  } catch (e2) {
    console.error('Dump attempt failed:', e2.message);
  }
  process.exit(1);
}
