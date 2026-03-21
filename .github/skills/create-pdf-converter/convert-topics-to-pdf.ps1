$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDir "../../..")
$inputDir = Join-Path $projectRoot "src/content/topics"
$outputDir = Join-Path $projectRoot "out/content/topics"
$jsScript = Join-Path $scriptDir "convert-topics-to-pdf.mjs"

if (-not (Test-Path $inputDir)) {
    Write-Output "No topic directory found at $inputDir"
    exit 0
}

New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$topicFiles = Get-ChildItem -Path $inputDir -Filter *.md -File -ErrorAction SilentlyContinue
if (-not $topicFiles -or $topicFiles.Count -eq 0) {
    Write-Output "No topic markdown files found in $inputDir"
    exit 0
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Output "Node.js not found. Skipping JavaScript conversion and trying pandoc fallback."
} else {
    & node $jsScript
    if ($LASTEXITCODE -eq 0) {
        exit 0
    }

    Write-Output "JavaScript conversion failed. Trying pandoc fallback in PowerShell."
}

if (-not (Get-Command pandoc -ErrorAction SilentlyContinue)) {
    Write-Error "Pandoc is not installed. Install pandoc to use fallback conversion."
    exit 1
}

$pdfEngine = $null
if (Get-Command weasyprint -ErrorAction SilentlyContinue) {
    $pdfEngine = "weasyprint"
} elseif (Get-Command wkhtmltopdf -ErrorAction SilentlyContinue) {
    $pdfEngine = "wkhtmltopdf"
} else {
    Write-Error "No supported PDF engine found. Install weasyprint or wkhtmltopdf."
    exit 1
}

$cssFile = Join-Path $scriptDir "pdf-light.css"
$converted = 0

foreach ($file in $topicFiles) {
    $outputFile = Join-Path $outputDir ("{0}.pdf" -f $file.BaseName)

    & pandoc $file.FullName `
        --from=gfm `
        --standalone `
        --css $cssFile `
        --pdf-engine=$pdfEngine `
        -V colorlinks=false `
        -o $outputFile

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Pandoc failed for $($file.FullName)"
        exit 1
    }

    $converted++
    Write-Output "Created $outputFile using pandoc ($pdfEngine)"
}

Write-Output "Done. Converted $converted topic file(s) into $outputDir"
exit 0
