// fix_package_json.js
import fs from "fs";
const path = "apps/api/package.json";
const backup = path + ".bak";

const raw = fs.readFileSync(path, "utf8");
fs.writeFileSync(backup, raw, "utf8");
console.log("Backup saved to", backup);

// Remove /* ... */ comments
let t = raw.replace(/\/\*[\s\S]*?\*\//g, "");
// Remove // line comments
t = t.replace(/(^|\n)\s*\/\/.*(?=\n|$)/g, "\n");
// Remove trailing commas in objects/arrays (simple heuristic)
t = t.replace(/,\s*(\}|])/g, "$1");

try {
  const obj = JSON.parse(t);
  fs.writeFileSync(path, JSON.stringify(obj, null, 2) + "\n", "utf8");
  console.log("Fixed JSON written to", path);
} catch (e) {
  console.error("Auto-fix failed:", e.message);
  console.error("Your backup is at", backup, " — please open it and correct manually.");
  process.exit(1);
}
