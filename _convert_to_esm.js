const fs = require("fs");
const path = require("path");

const TARGET_DIRS = ["controllers", "models", "routes", "middleware", "config"];
const ROOT_FILES = ["index.js", "seed.js"];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const original = content;

  // 1. Special-case: const cloudinary = require("cloudinary").v2
  content = content.replace(
    /const\s+([\w$]+)\s*=\s*require\(['"]([^'"]+)['"]\)\.v2;?/g,
    'import { v2 as $1 } from "$2";',
  );

  // 2. Destructured require: const { a, b } = require("pkg")
  content = content.replace(
    /const\s*\{([^}]+)\}\s*=\s*require\(['"]([^'"]+)['"]\);?/g,
    'import {$1} from "$2";',
  );

  // 3. Default require for controllers --> import * as
  content = content.replace(
    /const\s+([\w$]+)\s*=\s*require\(['"]([^'"]*[Cc]ontroller[^'"]*)['"]\);?/g,
    'import * as $1 from "$2";',
  );

  // 4. All other default requires
  content = content.replace(
    /const\s+([\w$]+)\s*=\s*require\(['"]([^'"]+)['"]\);?/g,
    'import $1 from "$2";',
  );

  // 5. exports.fn = ... --> export const fn =
  content = content.replace(/exports\.([\w$]+)\s*=/g, "export const $1 =");

  // 6. module.exports = ... --> export default ...
  content = content.replace(/module\.exports\s*=/g, "export default");

  // 7. Add .js extension to local imports (paths starting with . or ..)
  content = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
    if (!p1.endsWith(".js") && !p1.endsWith(".json") && !p1.endsWith(".mjs")) {
      return `from "${p1}.js"`;
    }
    return `from "${p1}"`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("  ✓ Converted:", path.relative(process.cwd(), filePath));
  } else {
    console.log(
      "  - Skipped (no changes):",
      path.relative(process.cwd(), filePath),
    );
  }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name.endsWith(".js")) {
      processFile(fullPath);
    }
  }
}

console.log("== Converting CommonJS -> ESM ==\n");

for (const dir of TARGET_DIRS) {
  walk(path.join(__dirname, dir));
}

for (const file of ROOT_FILES) {
  const full = path.join(__dirname, file);
  if (fs.existsSync(full)) processFile(full);
}

// Update package.json to add "type": "module"
const pkgPath = path.join(__dirname, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
if (pkg.type !== "module") {
  pkg.type = "module";
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
  console.log('\n✓ Added "type": "module" to package.json');
} else {
  console.log('\n- package.json already has "type": "module"');
}

console.log("\n== Done! ==");
