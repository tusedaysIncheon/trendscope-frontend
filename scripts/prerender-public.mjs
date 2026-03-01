import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const ROOT_DIR = process.cwd();
const DIST_DIR = path.resolve(ROOT_DIR, "dist");
const DIST_INDEX_HTML = path.join(DIST_DIR, "index.html");
const PRERENDER_SERVER_DIR = path.resolve(ROOT_DIR, ".prerender-server");
const PRERENDER_SERVER_ENTRY_FILE = path.join(PRERENDER_SERVER_DIR, "entry-prerender.mjs");

function stripBaseSeoTags(templateHtml) {
  return templateHtml
    .replace(/\s*<meta[^>]*name="description"[\s\S]*?\/?>/gi, "")
    .replace(/\s*<meta[^>]*property="og:[^"]+"[\s\S]*?\/?>/gi, "")
    .replace(/\s*<meta[^>]*name="twitter:[^"]+"[\s\S]*?\/?>/gi, "")
    .replace(/\s*<meta[^>]*name="robots"[\s\S]*?\/?>/gi, "")
    .replace(/\s*<meta[^>]*name="googlebot"[\s\S]*?\/?>/gi, "")
    .replace(/\s*<link[^>]*rel="canonical"[\s\S]*?\/?>/gi, "")
    .replace(/\s*<link[^>]*rel="alternate"[\s\S]*?\/?>/gi, "");
}

function injectRenderedHtml(templateHtml, appHtml, titleTag, headTags) {
  const withRoot = templateHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  const withTitle = titleTag ? withRoot.replace(/<title>[\s\S]*?<\/title>/i, titleTag) : withRoot;
  return withTitle.replace("</head>", `${headTags}</head>`);
}

function toOutputFilePath(routePath) {
  const normalized = routePath.replace(/^\/+/, "");
  return path.join(DIST_DIR, normalized, "index.html");
}

async function main() {
  const templateRaw = await fs.readFile(DIST_INDEX_HTML, "utf8");
  const template = stripBaseSeoTags(templateRaw);

  await fs.rm(PRERENDER_SERVER_DIR, { recursive: true, force: true });
  await build({
    configFile: path.resolve(ROOT_DIR, "vite.config.ts"),
    logLevel: "error",
    ssr: {
      noExternal: ["react-helmet-async"],
    },
    build: {
      ssr: path.resolve(ROOT_DIR, "src/entry-prerender.tsx"),
      outDir: PRERENDER_SERVER_DIR,
      emptyOutDir: true,
      minify: false,
      rollupOptions: {
        output: {
          entryFileNames: "entry-prerender.mjs",
        },
      },
    },
  });

  try {
    const entryUrl = pathToFileURL(PRERENDER_SERVER_ENTRY_FILE).href;
    const { getPrerenderRoutePaths, renderForPrerender } = await import(entryUrl);
    const routePaths = getPrerenderRoutePaths();

    for (const routePath of routePaths) {
      const { appHtml, titleTag, headTags } = renderForPrerender(routePath);
      const html = injectRenderedHtml(template, appHtml, titleTag, headTags);
      const outputFilePath = toOutputFilePath(routePath);

      await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
      await fs.writeFile(outputFilePath, html, "utf8");
      console.log(`[prerender] ${routePath} -> ${path.relative(DIST_DIR, outputFilePath)}`);
    }

    console.log(`[prerender] completed ${routePaths.length} routes`);
  } finally {
    await fs.rm(PRERENDER_SERVER_DIR, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error("[prerender] failed:", error);
  process.exit(1);
});
