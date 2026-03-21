import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../..");
const inputDir = path.join(rootDir, "src", "content", "topics");
const outputDir = path.join(rootDir, "out", "content", "topics");
const cssFile = path.join(__dirname, "pdf-light.css");

function run(command, args) {
  return spawnSync(command, args, { stdio: "pipe", encoding: "utf8" });
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadJavaScriptPdfTools() {
  let browserType = null;
  let createBrowser = null;

  try {
    const playwright = await import("playwright");
    browserType = "playwright";
    createBrowser = async () => playwright.chromium.launch({ headless: true });
  } catch {}

  if (!createBrowser) {
    try {
      const puppeteer = await import("puppeteer");
      browserType = "puppeteer";
      createBrowser = async () => puppeteer.default.launch({ headless: true });
    } catch {}
  }

  if (!createBrowser) {
    return null;
  }

  let markdownItFactory;
  try {
    const markdownIt = await import("markdown-it");
    markdownItFactory = markdownIt.default;
  } catch {
    return null;
  }

  return { browserType, createBrowser, markdownItFactory };
}

function buildHtmlDocument(markdownHtml, cssText, title) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>${cssText}</style>
</head>
<body>
${markdownHtml}
</body>
</html>`;
}

function extractContentAndSourceUrl(markdownText) {
  const frontmatterMatch = markdownText.match(/^---\n([\s\S]*?)\n---\n*/);
  if (!frontmatterMatch) {
    return { contentMarkdown: markdownText, sourceUrl: null };
  }

  const frontmatter = frontmatterMatch[1];
  const contentMarkdown = markdownText.slice(frontmatterMatch[0].length);
  const urlMatch = frontmatter.match(/\burl:\s*([^\s]+)/i);
  const sourceUrl = urlMatch ? urlMatch[1].trim() : null;

  return { contentMarkdown, sourceUrl };
}

function buildSourceLinkHtml(sourceUrl) {
  if (!sourceUrl) {
    return "";
  }

  const safeUrl = sourceUrl.replace(/"/g, "&quot;");
  return `<div class="study-tips-source-anchor"><p class="source-inline"><a href="${safeUrl}">${safeUrl}</a></p></div>`;
}

async function convertWithJavaScript(topicFiles) {
  const tools = await loadJavaScriptPdfTools();
  if (!tools) {
    return { ok: false, reason: "missing-js-dependencies" };
  }

  const cssText = await fs.readFile(cssFile, "utf8");
  const md = tools.markdownItFactory({ html: false, linkify: true, typographer: true });

  const browser = await tools.createBrowser();
  let converted = 0;

  try {
    for (const topicPath of topicFiles) {
      const markdown = await fs.readFile(topicPath, "utf8");
      const { contentMarkdown, sourceUrl } = extractContentAndSourceUrl(markdown);
      const html = md.render(contentMarkdown);
      const sourceLinkHtml = buildSourceLinkHtml(sourceUrl);
      const base = path.basename(topicPath, ".md");
      const outputPath = path.join(outputDir, `${base}.pdf`);
      const studyTipsMarker = /(<h[1-6][^>]*>\s*Study Tips\s*<\/h[1-6]>)/i;
      let finalHtml = html;

      if (sourceLinkHtml) {
        const studyTipsListPattern = /(<h[1-6][^>]*>\s*Study Tips\s*<\/h[1-6]>[\s\S]*?<ul>[\s\S]*?<\/ul>)/i;
        if (studyTipsListPattern.test(html)) {
          finalHtml = html.replace(studyTipsListPattern, `$1${sourceLinkHtml}`);
        } else if (studyTipsMarker.test(html)) {
          finalHtml = html.replace(studyTipsMarker, `$1${sourceLinkHtml}`);
        } else {
          finalHtml = `${html}${sourceLinkHtml}`;
        }
      }

      const documentHtml = buildHtmlDocument(finalHtml, cssText, base);

      const page = await browser.newPage();
      await page.setContent(documentHtml, { waitUntil: "load" });
      await page.pdf({
        path: outputPath,
        width: "198mm",
        height: "264mm",
        margin: { top: "11mm", right: "12mm", bottom: "11mm", left: "12mm" },
        printBackground: false,
        preferCSSPageSize: true
      });
      await page.close();
      converted += 1;
      console.log(`Created ${outputPath} using ${tools.browserType}`);
    }
  } finally {
    await browser.close();
  }

  return { ok: true, converted };
}

async function convertWithPandoc(topicFiles) {
  const pandocCheck = run("pandoc", ["--version"]);
  if (pandocCheck.status !== 0) {
    return { ok: false, reason: "pandoc-not-found" };
  }

  let pdfEngine = null;
  if (run("weasyprint", ["--version"]).status === 0) {
    pdfEngine = "weasyprint";
  } else if (run("wkhtmltopdf", ["--version"]).status === 0) {
    pdfEngine = "wkhtmltopdf";
  } else {
    return { ok: false, reason: "no-pdf-engine" };
  }

  let converted = 0;
  for (const topicPath of topicFiles) {
    const base = path.basename(topicPath, ".md");
    const outputPath = path.join(outputDir, `${base}.pdf`);
    const result = run("pandoc", [
      topicPath,
      "--from=gfm",
      "--standalone",
      "--css",
      cssFile,
      "--pdf-engine",
      pdfEngine,
      "-V",
      "colorlinks=false",
      "-o",
      outputPath
    ]);

    if (result.status !== 0) {
      return {
        ok: false,
        reason: "pandoc-conversion-failed",
        details: result.stderr || result.stdout
      };
    }

    converted += 1;
    console.log(`Created ${outputPath} using pandoc (${pdfEngine})`);
  }

  return { ok: true, converted };
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const entries = await fs.readdir(inputDir, { withFileTypes: true }).catch(() => []);
  const topicFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => path.join(inputDir, entry.name));

  if (topicFiles.length === 0) {
    console.log(`No topic markdown files found in ${inputDir}`);
    process.exit(0);
  }

  if (!(await exists(cssFile))) {
    console.error(`Missing CSS file: ${cssFile}`);
    process.exit(1);
  }

  let jsResult;
  try {
    jsResult = await convertWithJavaScript(topicFiles);
  } catch (error) {
    jsResult = {
      ok: false,
      reason: "js-conversion-failed",
      details: error instanceof Error ? error.message : String(error)
    };
  }
  if (jsResult.ok) {
    console.log(`Done. Converted ${jsResult.converted} topic file(s) into ${outputDir}`);
    process.exit(0);
  }

  console.warn(`JavaScript conversion unavailable (${jsResult.reason}). Falling back to pandoc.`);
  if (jsResult.details) {
    console.warn(jsResult.details);
  }
  const pandocResult = await convertWithPandoc(topicFiles);
  if (!pandocResult.ok) {
    console.error(`PDF conversion failed: ${pandocResult.reason}`);
    if (pandocResult.details) {
      console.error(pandocResult.details);
    }
    process.exit(1);
  }

  console.log(`Done. Converted ${pandocResult.converted} topic file(s) into ${outputDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
