import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { marked } from "marked";
import { shell } from "./site-shell.mjs";

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content", "writing");
const generatedDir = path.join(rootDir, "generated");
const routeRootDir = path.join(rootDir, "writing");
const generatedDataFile = path.join(generatedDir, "writing-data.js");

marked.setOptions({
  headerIds: true,
  mangle: false,
});

function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

function formatIsoDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function getPostFiles() {
  if (!existsSync(contentDir)) {
    return [];
  }

  return readdirSync(contentDir)
    .filter((file) => file.endsWith(".md"))
    .sort();
}

function getPostHtmlShell(slug, title) {
  const escapedTitle = title
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
  return shell({
    title: `${escapedTitle} — Konstantine Kahadze`,
    description:
      "An essay by Konstantine Kahadze on language, technology, and AI.",
    page: "writing",
    script: "writing-post-page.js",
    extraScript: `window.__WRITING_SLUG__ = ${JSON.stringify(slug)};`,
    content: `<main id="main" class="page-main writing-post-page"><a class="back-link" href="/writing/"><span aria-hidden="true">←</span> <span data-i18n="writingBack">Back to writing</span></a><article class="writing-post" id="writing-post"></article></main>`,
  });
}

function writePostRoutes(posts) {
  ensureDir(routeRootDir);

  for (const entry of readdirSync(routeRootDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      rmSync(path.join(routeRootDir, entry.name), {
        recursive: true,
        force: true,
      });
    }
  }

  for (const post of posts) {
    const postDir = path.join(routeRootDir, post.slug);
    ensureDir(postDir);
    writeFileSync(
      path.join(postDir, "index.html"),
      getPostHtmlShell(post.slug, post.title),
    );
  }
}

function main() {
  ensureDir(generatedDir);
  ensureDir(routeRootDir);
  ensureDir(contentDir);

  const posts = getPostFiles()
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const source = readFileSync(path.join(contentDir, fileName), "utf8");
      const { data, content } = matter(source);
      const title = typeof data.title === "string" ? data.title.trim() : slug;
      const description =
        typeof data.description === "string" ? data.description.trim() : "";
      const date = formatIsoDate(data.date);

      return {
        slug,
        title,
        description,
        date,
        contentHtml: marked.parse(content),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const fileContents = `export const posts = ${JSON.stringify(posts, null, 2)};\n`;
  writeFileSync(generatedDataFile, fileContents);
  writePostRoutes(posts);
}

main();
