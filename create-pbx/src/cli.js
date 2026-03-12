#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  const args = process.argv.slice(2);
  let projectName = "";

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name" || args[i] === "-n") {
      projectName = args[i + 1] || "";
      break;
    }
  }

  // If no name found via flag, check positional argument
  if (!projectName && args[0] && !args[0].startsWith("-")) {
    projectName = args[0];
  }

  // If still no name, prompt the user
  if (!projectName) {
    projectName = await ask("📁 Enter project name (default: my-pbx-app): ");
    projectName = projectName.trim() || "my-pbx-app";
  }

  const templateDir = path.resolve(__dirname, "..");

  console.log(`🚀 Creating a new PBX (Prisma Better-auth Express) project in: ${projectName}`);

  if (fs.existsSync(projectName)) {
    console.error(`❌ Error: Directory "${projectName}" already exists.`);
    rl.close();
    process.exit(1);
  }

  // 1. Create project directory
  fs.mkdirSync(projectName);
  process.chdir(projectName);

  // 2. Copy files from template
  console.log("📂 Copying template files...");
  const itemsToCopy = [
    "src",
    "prisma",
    "tsconfig.json",
    "prisma.config.ts",
    ".env.example",
    ".gitignore",
    "package.template.json"
  ];

  itemsToCopy.forEach((item) => {
    const srcPath = path.join(templateDir, item);
    let destPath = path.join(process.cwd(), item);

    if (item === "package.template.json") {
      destPath = path.join(process.cwd(), "package.json");
    }

    if (fs.existsSync(srcPath)) {
      if (item === "src") {
        // Copy src while excluding cli.js
        if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
        const files = fs.readdirSync(srcPath);
        files.forEach(file => {
          if (file !== "cli.js") {
            fs.cpSync(path.join(srcPath, file), path.join(destPath, file), { recursive: true });
          }
        });
      } else {
        fs.cpSync(srcPath, destPath, { recursive: true });
      }
    }
  });

  // 3. Update project name in package.json
  const pkgPath = path.join(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  // 4. Ask to install dependencies
  const installDeps = await ask("📥 Do you want to install dependencies now? (y/n): ");
  rl.close();

  if (installDeps.toLowerCase() === "y" || installDeps.toLowerCase() === "yes") {
    console.log("📥 Installing dependencies...");
    try {
      execSync("npm install", { stdio: "inherit" });
    } catch (error) {
      console.error("❌ Failed to install dependencies. You may need to run 'npm install' manually.");
    }
  } else {
    console.log("⚠️ Skipping dependency installation. You will need to run 'npm install' manually.");
  }

  console.log(`
✅ Project "${projectName}" created successfully!
`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});