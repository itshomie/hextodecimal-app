import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const minWords = 800;
const failures = [];

const htmlFiles = await collectHtml(dist);
const existingPaths = new Set();

for (const file of htmlFiles) {
  const relative = "/" + path.relative(dist, file).replaceAll(path.sep, "/");
  if (relative === "/index.html") existingPaths.add("/");
  else if (relative.endsWith("/index.html")) existingPaths.add(relative.replace(/index\.html$/, ""));
  else existingPaths.add(relative);
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const pagePath = "/" + path.relative(dist, file).replaceAll(path.sep, "/");

  if (/mailto:/i.test(html)) {
    failures.push(`${pagePath}: contains a mailto link`);
  }

  const hrefs = [...html.matchAll(/\shref="([^"]*)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (!href || href === "#") failures.push(`${pagePath}: empty href ${href}`);
    if (href.startsWith("/") && !href.startsWith("/assets/")) {
      const clean = href.split("#")[0];
      if (clean && !existingPaths.has(clean)) failures.push(`${pagePath}: broken internal link ${href}`);
    }
  }

  const isConverterPage = /data-tool="/.test(html);
  if (isConverterPage) {
    const words = visibleWords(html);
    if (words < minWords) failures.push(`${pagePath}: ${words} visible words, expected at least ${minWords}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} HTML files. Converter pages meet ${minWords}+ visible words, internal links resolve, and email links are plain text.`);

async function collectHtml(directory) {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry);
    const details = await stat(full);
    if (details.isDirectory()) files.push(...(await collectHtml(full)));
    else if (entry.endsWith(".html")) files.push(full);
  }
  return files;
}

function visibleWords(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.split(/\s+/).length : 0;
}
