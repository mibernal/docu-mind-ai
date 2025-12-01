// check_json.js
import fs from "fs";
const path = "apps/api/package.json";
try {
  const s = fs.readFileSync(path, "utf8");
  JSON.parse(s);
  console.log(`${path} is valid JSON.`);
} catch (e) {
  console.error("ERROR parsing JSON:", e.message);
  // show file with line numbers
  const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    console.log(String(i+1).padStart(4, " ") + ": " + lines[i]);
  }
  process.exit(1);
}
