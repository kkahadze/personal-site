import { readdirSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

function collectHtmlEntries(dir, entries = {}) {
  const dirents = readdirSync(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    if (dirent.name === "dist" || dirent.name === "node_modules" || dirent.name.startsWith(".")) {
      continue;
    }

    const fullPath = resolve(dir, dirent.name);

    if (dirent.isDirectory()) {
      collectHtmlEntries(fullPath, entries);
      continue;
    }

    if (!dirent.name.endsWith(".html")) {
      continue;
    }

    const key = fullPath
      .replace(`${resolve(__dirname, "")}/`, "")
      .replace(/\.html$/, "")
      .replace(/[\\/]/g, "-");
    entries[key] = fullPath;
  }

  return entries;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: collectHtmlEntries(__dirname),
    },
  },
});
