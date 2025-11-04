// tree.cjs
const fs = require("fs");
const path = require("path");

const outputFile = "estructura.txt";
const excludeList = ["node_modules", ".git", "package-lock.json"];

// Función recursiva para imprimir el árbol
function generateTree(dir, prefix = "") {
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(item => !excludeList.includes(item.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  let output = "";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isLast = i === items.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const nextPrefix = prefix + (isLast ? "    " : "│   ");

    output += `${prefix}${connector}${item.name}\n`;

    if (item.isDirectory()) {
      output += generateTree(path.join(dir, item.name), nextPrefix);
    }
  }

  return output;
}

// Generar el árbol
const projectName = path.basename(process.cwd());
let treeOutput = `${projectName}\n`;
treeOutput += generateTree(process.cwd());

// Guardar en archivo .txt
fs.writeFileSync(outputFile, treeOutput, "utf8");

console.log(`✅ Estructura generada correctamente en "${outputFile}"`);
