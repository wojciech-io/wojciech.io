# Page Optimizer Plugin — instalator dla Windows (PowerShell)
# Uruchom: powershell -ExecutionPolicy Bypass -File install.ps1

$pluginName = "page-optimizer"
$targetDir  = Join-Path $env:USERPROFILE ".claude\plugins\$pluginName"
$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "Instalacja pluginu: $pluginName" -ForegroundColor Cyan
Write-Host "Cel: $targetDir"
Write-Host ""

if (Test-Path $targetDir) {
    Write-Host "Plugin juz istnieje. Nadpisuje..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $targetDir
}

Copy-Item -Recurse -Force $scriptDir $targetDir

Write-Host "Gotowe!" -ForegroundColor Green
Write-Host ""
Write-Host "Nastepny krok: zrestartuj Claude Code." -ForegroundColor White
Write-Host "Dostepne skille: /audit-page, /optimize-page, /color-review, /responsive-check, /llm-copy, /visual-harmony"
Write-Host ""
