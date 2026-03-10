#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";

const projectName = process.argv[2] || "my-app";

console.log("Creating project:", projectName);

fs.mkdirSync(projectName);

process.chdir(projectName);

execSync("npm init -y", { stdio: "inherit" });

execSync(
  "npm install express prisma better-auth @prisma/client cors dotenv",
  { stdio: "inherit" }
);

console.log("Project created successfully!");