# Slow Dating — deploy naar Netlify
# Gebruik: rechtsklik → "Run with PowerShell"
# Of in terminal: .\deploy.ps1

$env:PATH = "C:\Program Files\nodejs;" + $env:PATH + ";C:\Users\Eliane Stolper\AppData\Roaming\npm"
$env:NODE_OPTIONS = "--openssl-legacy-provider"

Write-Host "Deploying koppel-frontend naar Netlify..." -ForegroundColor Green

& "C:\Users\Eliane Stolper\AppData\Roaming\npm\netlify.cmd" deploy `
    --dir koppel-frontend `
    --prod `
    --site 01474193-4408-4e98-a667-f6d427e6768a `
    --no-build

Write-Host "Klaar!" -ForegroundColor Green
