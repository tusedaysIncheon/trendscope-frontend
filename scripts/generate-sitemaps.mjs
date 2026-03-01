import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  LANGUAGES,
  PUBLIC_PATHS,
  formatDate,
  resolvePriority,
  toAbsoluteUrl,
  withLanguagePrefix,
} from "./seo-config.mjs";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.resolve(ROOT_DIR, "public");

function buildUrlSetXml(language) {
  const urls = PUBLIC_PATHS.map(({ path: publicPath, changefreq }) => {
    const localizedPath = withLanguagePrefix(language, publicPath);
    const loc = toAbsoluteUrl(localizedPath);
    const priority = resolvePriority(language, publicPath);
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildSitemapIndexXml(generatedDate) {
  const items = LANGUAGES.map((language) => {
    const sitemapUrl = toAbsoluteUrl(`/sitemap-${language}.xml`);
    return [
      "  <sitemap>",
      `    <loc>${sitemapUrl}</loc>`,
      `    <lastmod>${generatedDate}</lastmod>`,
      "  </sitemap>",
    ].join("\n");
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

async function main() {
  const generatedDate = formatDate();
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  for (const language of LANGUAGES) {
    const outputPath = path.join(PUBLIC_DIR, `sitemap-${language}.xml`);
    const xml = buildUrlSetXml(language);
    await fs.writeFile(outputPath, xml, "utf8");
    console.log(`[sitemap] wrote ${path.relative(ROOT_DIR, outputPath)}`);
  }

  const sitemapIndexXml = buildSitemapIndexXml(generatedDate);
  const sitemapIndexPath = path.join(PUBLIC_DIR, "sitemap.xml");
  await fs.writeFile(sitemapIndexPath, sitemapIndexXml, "utf8");
  console.log(`[sitemap] wrote ${path.relative(ROOT_DIR, sitemapIndexPath)}`);
}

main().catch((error) => {
  console.error("[sitemap] failed:", error);
  process.exit(1);
});
