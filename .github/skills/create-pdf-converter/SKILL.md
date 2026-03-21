---
name: create-pdf-converter
description: "Use when: converting IELTS topic markdown files to lightweight, readable PDF files for 13-inch iPad study; generating one PDF per topic into out/content/topics with PowerShell and JavaScript-first conversion"
---

# Create PDF Converter

Use this skill when the user wants to export topic markdown files from `src/content/topics/` into PDF files for offline study. The result should be one PDF per topic, with light formatting and small file size, saved under `out/content/topics/`.

## Goal

Convert each topic markdown file into a separate PDF file that is easy to read on a 13-inch iPad and lightweight enough for quick opening and storage.

## Shell Constraint

1. Use PowerShell commands only.
2. Do not use bash or zsh commands in this skill workflow.

## Output Rules

1. Input files come from `src/content/topics/*.md`.
2. Output files must be written to `out/content/topics/`.
3. Keep the same base name for each file (for example, `urban-planning.md` -> `urban-planning.pdf`).
4. Generate one PDF per topic file.
5. Prefer a clean layout: readable font size, moderate line length, simple headings, and no heavy graphics.
6. Do not render full frontmatter metadata in the leading section.
7. Show only the source URL as a clickable link directly below the Study Tips bullet list, with visual spacing that places it closer to the page bottom.

## Formatting and Size Guidelines

1. Keep styling minimal and print-friendly.
2. Use a light serif body font for long reading.
3. Use modest heading sizes and spacing.
4. Avoid decorative backgrounds, large images, and complex layout elements.
5. Target 13-inch iPad portrait reading dimensions with compact margins.

## Recommended Tooling

Use JavaScript conversion first, and use `pandoc` only as fallback:

- PowerShell script: `.github/skills/create-pdf-converter/convert-topics-to-pdf.ps1`
- JavaScript converter: `.github/skills/create-pdf-converter/convert-topics-to-pdf.mjs`
- Style: `.github/skills/create-pdf-converter/pdf-light.css`

## Workflow

1. Ensure output folder exists: `out/content/topics/`.
2. Try JavaScript conversion first (Playwright or Puppeteer).
3. If JavaScript conversion is unavailable or fails, use Pandoc fallback.
4. Apply the lightweight CSS and iPad-oriented page settings.
5. Validate that each source markdown has a matching PDF output.
6. Report converted file count and output location.

## Command

Run (PowerShell):

```powershell
pwsh -File .github/skills/create-pdf-converter/convert-topics-to-pdf.ps1
```

## Notes

- If JavaScript dependencies are unavailable, fallback to Pandoc.
- If `pandoc` is missing during fallback, install Pandoc and either WeasyPrint or wkhtmltopdf.
- If no topic markdown files exist, return a clear message and skip conversion.
- Keep output deterministic so re-running updates files in place.
