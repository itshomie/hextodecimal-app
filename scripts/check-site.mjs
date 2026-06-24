import { access, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const siteUrl = "https://hextodecimal.app";
const minConverterWords = 800;
const minBlogPostWords = 550;
const maxArticleSimilarity = 0.55;
const nonIndexablePaths = new Set([
  "/404.html",
  "/about/",
  "/contact/",
  "/team-services/",
  "/privacy-policy/",
  "/terms-of-use/",
  "/cookie-policy/"
]);
const expectedRedirects = new Map([
  ["/hex-to-decimal-converter", "/"],
  ["/hex-to-decimal-converter/", "/"],
  ["/binary-to-decimal-converter", "/binary-to-decimal/"],
  ["/binary-to-decimal-converter/", "/binary-to-decimal/"],
  ["/binary-to-hexadecimal", "/binary-to-hex/"],
  ["/binary-to-hexadecimal/", "/binary-to-hex/"],
  ["/hexadecimal-calculator", "/hex-calculator/"],
  ["/hexadecimal-calculator/", "/hex-calculator/"]
]);
const failures = [];

const htmlFiles = await collectHtml(dist);
const existingPaths = new Set(htmlFiles.map(publicPathFor));
const sitemapPaths = await readSitemapPaths();
const robotsTxt = await readFile(path.join(dist, "robots.txt"), "utf8");
const redirectsTxt = await readFile(path.join(dist, "_redirects"), "utf8").catch(() => "");

if (!robotsTxt.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
  failures.push("robots.txt: missing canonical sitemap URL");
}
if (/Disallow:\s*\//i.test(robotsTxt)) {
  failures.push("robots.txt: blocks crawling; use noindex meta for pages that should not appear in Search");
}

const titles = new Map();
const descriptions = new Map();
const converterArticles = [];
let converterCount = 0;
let blogPostCount = 0;
let blogIndexCount = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const pagePath = publicPathFor(file);
  const isConverterPage = /data-tool="/.test(html);
  const isBlogPostPage = /data-page-type="blog-post"/.test(html);
  const isBlogIndexPage = /data-page-type="blog-index"/.test(html);
  const visibleTextContent = visibleText(html);
  const words = wordCount(visibleTextContent);
  const title = getTagContent(html, "title");
  const description = getMetaContent(html, "description");
  const canonical = getLinkHref(html, "canonical");
  const robots = getMetaContent(html, "robots").toLowerCase();
  const h1 = getTagContent(html, "h1");
  const charsetIndex = html.indexOf('<meta charset="utf-8">');
  const analyticsIndex = html.indexOf("googletagmanager.com/gtag/js");

  if (charsetIndex === -1) failures.push(`${pagePath}: missing charset meta`);
  if (analyticsIndex !== -1 && charsetIndex > analyticsIndex) {
    failures.push(`${pagePath}: charset meta should appear before analytics scripts`);
  }

  if (!title) failures.push(`${pagePath}: missing title`);
  if (!description) failures.push(`${pagePath}: missing meta description`);
  if (!canonical) failures.push(`${pagePath}: missing canonical URL`);
  if (canonical && canonical !== siteUrl + pagePath) {
    failures.push(`${pagePath}: canonical ${canonical} does not match expected ${siteUrl + pagePath}`);
  }

  pushUnique(titles, title, pagePath, "title");
  pushUnique(descriptions, description, pagePath, "meta description");

  if (isConverterPage) {
    converterCount += 1;
    if (robots.includes("noindex")) failures.push(`${pagePath}: converter page is marked noindex`);
    if (!sitemapPaths.has(pagePath)) failures.push(`${pagePath}: converter page missing from sitemap.xml`);
    if (words < minConverterWords) failures.push(`${pagePath}: ${words} visible words, expected at least ${minConverterWords}`);
    if (title.length < 35 || title.length > 65) {
      failures.push(`${pagePath}: title length ${title.length} should stay between 35 and 65 characters`);
    }
    if (description.length < 80 || description.length > 160) {
      failures.push(`${pagePath}: meta description length ${description.length} should stay between 80 and 160 characters`);
    }
    if (!title.toLowerCase().includes(h1.toLowerCase())) {
      failures.push(`${pagePath}: title does not include the H1/core keyword "${h1}"`);
    }
    if (!descriptionCoversKeyword(description, h1)) {
      failures.push(`${pagePath}: meta description does not sufficiently cover the H1/core keyword "${h1}"`);
    }
    converterArticles.push({ pagePath, text: visibleText(extractArticle(html)) });
  } else if (isBlogPostPage) {
    blogPostCount += 1;
    if (robots.includes("noindex")) failures.push(`${pagePath}: blog post is marked noindex`);
    if (!sitemapPaths.has(pagePath)) failures.push(`${pagePath}: blog post missing from sitemap.xml`);
    if (words < minBlogPostWords) failures.push(`${pagePath}: ${words} visible words, expected at least ${minBlogPostWords}`);
    if (title.length < 30 || title.length > 70) {
      failures.push(`${pagePath}: blog title length ${title.length} should stay between 30 and 70 characters`);
    }
    if (description.length < 80 || description.length > 160) {
      failures.push(`${pagePath}: blog meta description length ${description.length} should stay between 80 and 160 characters`);
    }
  } else if (isBlogIndexPage) {
    blogIndexCount += 1;
    if (robots.includes("noindex")) failures.push(`${pagePath}: blog index is marked noindex`);
    if (!sitemapPaths.has(pagePath)) failures.push(`${pagePath}: blog index missing from sitemap.xml`);
  } else {
    if (!robots.includes("noindex")) failures.push(`${pagePath}: non-core page should be noindex,follow`);
    if (sitemapPaths.has(pagePath)) failures.push(`${pagePath}: non-core noindex page should not be in sitemap.xml`);
  }

  if (/mailto:/i.test(html)) {
    failures.push(`${pagePath}: contains a mailto link`);
  }

  for (const href of getHrefs(html)) {
    await checkHref(pagePath, href);
  }

  for (const json of getJsonLdBlocks(html)) {
    try {
      const parsed = JSON.parse(json);
      if (parsed["@type"] === "FAQPage") {
        failures.push(`${pagePath}: FAQPage structured data is not appropriate for this utility site`);
      }
    } catch (error) {
      failures.push(`${pagePath}: invalid JSON-LD (${error.message})`);
    }
  }
}

for (const sitemapPath of sitemapPaths) {
  if (!existingPaths.has(sitemapPath)) failures.push(`sitemap.xml: ${sitemapPath} does not exist in dist`);
  if (nonIndexablePaths.has(sitemapPath)) failures.push(`sitemap.xml: includes non-indexable page ${sitemapPath}`);
}

const redirectRules = parseRedirects(redirectsTxt);
for (const [source, target] of expectedRedirects) {
  if (redirectRules.get(source) !== target) {
    failures.push(`_redirects: missing 301 from ${source} to ${target}`);
  }
  const sourcePath = source.endsWith("/") ? source : `${source}/`;
  if (existingPaths.has(sourcePath)) failures.push(`${sourcePath}: redirect source should not also generate HTML`);
  if (sitemapPaths.has(sourcePath)) failures.push(`sitemap.xml: includes redirect source ${sourcePath}`);
  if (!existingPaths.has(target)) failures.push(`_redirects: target ${target} for ${source} does not exist`);
}

for (let i = 0; i < converterArticles.length; i += 1) {
  for (let j = i + 1; j < converterArticles.length; j += 1) {
    const score = shingleSimilarity(converterArticles[i].text, converterArticles[j].text);
    if (score > maxArticleSimilarity) {
      failures.push(
        `${converterArticles[i].pagePath} and ${converterArticles[j].pagePath}: article similarity ${score.toFixed(
          2
        )}, expected <= ${maxArticleSimilarity}`
      );
    }
  }
}

const indexableCount = converterCount + blogPostCount + blogIndexCount;
if (indexableCount !== sitemapPaths.size) {
  failures.push(`sitemap.xml: expected ${indexableCount} indexable URLs, found ${sitemapPaths.size}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `Checked ${htmlFiles.length} HTML files. ${converterCount} converter pages and ${blogPostCount} blog posts are indexable, redirects consolidate duplicate tools, non-core pages are noindex and excluded from sitemap.xml, internal links resolve, SEO tags are present, JSON-LD parses, and article similarity stays below ${maxArticleSimilarity}.`
);

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

async function readSitemapPaths() {
  const xml = await readFile(path.join(dist, "sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  return new Set(
    locs.map((loc) => {
      const url = new URL(loc);
      return url.pathname;
    })
  );
}

function publicPathFor(file) {
  const relative = "/" + path.relative(dist, file).replaceAll(path.sep, "/");
  if (relative === "/index.html") return "/";
  if (relative.endsWith("/index.html")) return relative.replace(/index\.html$/, "");
  return relative;
}

function getTagContent(html, tag) {
  return stripTags(html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] || "").trim();
}

function getMetaContent(html, name) {
  return html.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, "i"))?.[1] || "";
}

function getLinkHref(html, rel) {
  return html.match(new RegExp(`<link\\s+rel="${rel}"\\s+href="([^"]*)"`, "i"))?.[1] || "";
}

function getHrefs(html) {
  return [...html.matchAll(/\shref="([^"]*)"/g)].map((match) => match[1]);
}

function getJsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) =>
    match[1].trim()
  );
}

function parseRedirects(value) {
  const rules = new Map();
  for (const line of value.split(/\r?\n/)) {
    const clean = line.trim();
    if (!clean || clean.startsWith("#")) continue;
    const [source, target, status] = clean.split(/\s+/);
    if (status === "301") rules.set(source, target);
  }
  return rules;
}

function extractArticle(html) {
  return html.match(/<article class="article">([\s\S]*?)<\/article>/i)?.[1] || "";
}

function visibleText(html) {
  return stripTags(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/&[a-z0-9#]+;/gi, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ");
}

function wordCount(text) {
  return text ? text.split(/\s+/).length : 0;
}

function descriptionCoversKeyword(description, h1) {
  const descriptionWords = new Set(description.toLowerCase().match(/[a-z0-9]+/g) || []);
  const keywordWords = (h1.toLowerCase().match(/[a-z0-9]+/g) || []).filter((word) => word !== "to" && word !== "and");
  return keywordWords.every((word) => descriptionWords.has(word));
}

function pushUnique(map, value, pagePath, label) {
  if (!value) return;
  const existing = map.get(value);
  if (existing) failures.push(`${pagePath}: duplicate ${label} also used by ${existing}`);
  else map.set(value, pagePath);
}

async function checkHref(pagePath, href) {
  if (!href || href === "#") {
    failures.push(`${pagePath}: empty href ${href}`);
    return;
  }
  if (href.startsWith("#")) return;
  if (/^(https?:)?\/\//i.test(href)) return;
  if (!href.startsWith("/")) return;

  const clean = href.split("#")[0];
  if (!clean) return;

  if (clean.startsWith("/assets/")) {
    try {
      await access(path.join(dist, clean));
    } catch {
      failures.push(`${pagePath}: missing asset ${href}`);
    }
    return;
  }

  if (!existingPaths.has(clean)) failures.push(`${pagePath}: broken internal link ${href}`);
}

function shingleSimilarity(left, right) {
  const leftSet = shingles(left);
  const rightSet = shingles(right);
  if (!leftSet.size || !rightSet.size) return 0;
  let intersection = 0;
  for (const item of leftSet) {
    if (rightSet.has(item)) intersection += 1;
  }
  return intersection / (leftSet.size + rightSet.size - intersection);
}

function shingles(text, size = 5) {
  const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
  const result = new Set();
  for (let i = 0; i <= words.length - size; i += 1) {
    result.add(words.slice(i, i + size).join(" "));
  }
  return result;
}
