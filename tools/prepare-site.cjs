const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const appDir = path.join(root, "app");

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(appDir, { recursive: true });

fs.copyFileSync(path.join(root, "app.js"), path.join(publicDir, "game.js"));
fs.copyFileSync(path.join(root, "style.css"), path.join(appDir, "site.css"));
fs.copyFileSync(
  path.join(root, "manifest.webmanifest"),
  path.join(publicDir, "manifest.webmanifest")
);
fs.cpSync(path.join(root, "data"), path.join(publicDir, "data"), {
  recursive: true
});
fs.cpSync(path.join(root, "assets"), path.join(publicDir, "assets"), {
  recursive: true
});
