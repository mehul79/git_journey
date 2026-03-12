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
    projectName = await ask("📁 Enter project name (default: my-pba-app): ");
    projectName = projectName.trim() || "my-pba-app";
  }

  const templateDir = path.resolve(__dirname, "..");

  console.log(`🚀 Creating a new Prisma Better Auth project in: ${projectName}`);

  if (fs.existsSync(projectName)) {
    console.error(`❌ Error: Directory "${projectName}" already exists.`);
    rl.close();
    process.exit(1);
  }

  // 1. Create project directory
  fs.mkdirSync(projectName);
  process.chdir(projectName);

  // 2. Initialize npm
  console.log("📦 Initializing project...");
  execSync("npm init -y", { stdio: "inherit" });

  // 3. Copy files from template
  console.log("📂 Copying template files...");
  const itemsToCopy = [
    "src",
    "prisma",
    "tsconfig.json",
    "prisma.config.ts",
    ".env.example",
    ".gitignore"
  ];

  itemsToCopy.forEach((item) => {
    const srcPath = path.join(templateDir, item);
    const destPath = path.join(process.cwd(), item);

    if (fs.existsSync(srcPath)) {
      if (item === "src") {
        // Copy src while excluding cli.ts
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

  // 4. Ask to install dependencies
  const installDeps = await ask("📥 Do you want to install dependencies now? (y/n): ");
  rl.close();

  if (installDeps.toLowerCase() === "y" || installDeps.toLowerCase() === "yes") {
    console.log("📥 Installing dependencies...");
    const deps = [
      "express",
      "prisma",
      "better-auth",
      "@prisma/client",
      "cors",
      "dotenv"
    ];
    const devDeps = [
      "typescript",
      "ts-node",
      "nodemon",
      "@types/express",
      "@types/cors",
      "@types/node"
    ];

    execSync(`npm install ${deps.join(" ")}`, { stdio: "inherit" });
    execSync(`npm install -D ${devDeps.join(" ")}`, { stdio: "inherit" });
  } else {
    console.log("⚠️ Skipping dependency installation. You will need to run 'npm install' manually.");
  }

  // 5. Update package.json in the new project to include scripts
  const pkgPath = path.join(process.cwd(), "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.scripts = {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "generate": "prisma generate",
    "studio": "prisma studio"
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  console.log(`
✅ Project "${projectName}" created successfully!
`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});