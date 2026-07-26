const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const metadataDir = path.join(distDir, ".openai");

fs.mkdirSync(metadataDir, { recursive: true });
fs.copyFileSync(
  path.join(root, ".openai", "hosting.json"),
  path.join(metadataDir, "hosting.json")
);
