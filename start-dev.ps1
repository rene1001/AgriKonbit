# AgriKonbit - Script de démarrage PowerShell
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  AGRIKONBIT - DEMARRAGE ENVIRONNEMENT DE DEVELOPPEMENT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "server")) {
    Write-Host "[ERREUR] Repertoire server non trouve" -ForegroundColor Red
    Write-Host "Assurez-vous d'executer ce script depuis le repertoire racine AgriKonbit" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entree pour quitter"
    exit 1
}

if (-not (Test-Path "client")) {
    Write-Host "[ERREUR] Repertoire client non trouve" -ForegroundColor Red
    Write-Host "Assurez-vous d'executer ce script depuis le repertoire racine AgriKonbit" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entree pour quitter"
    exit 1
}

# Vérification de la base de données
Write-Host "[1/4] Verification de la base de donnees..." -ForegroundColor Yellow
Set-Location migrations
try {
    node verify-fixes.js
    if ($LASTEXITCODE -ne 0) {
        throw "Verification failed"
    }
} catch {
    Write-Host ""
    Write-Host "[ERREUR] La verification de la base de donnees a echoue" -ForegroundColor Red
    Write-Host "Veuillez executer d'abord: node migrations/run-fixes.js" -ForegroundColor Yellow
    Set-Location ..
    Read-Host "Appuyez sur Entree pour quitter"
    exit 1
}
Set-Location ..

# Vérification des dépendances backend
Write-Host ""
Write-Host "[2/4] Verification des dependances backend..." -ForegroundColor Yellow
Set-Location server
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dependances backend..." -ForegroundColor Cyan
    npm install
}
Set-Location ..

# Vérification des dépendances frontend
Write-Host ""
Write-Host "[3/4] Verification des dependances frontend..." -ForegroundColor Yellow
Set-Location client
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dependances frontend..." -ForegroundColor Cyan
    npm install
}
Set-Location ..

# Démarrage des serveurs
Write-Host ""
Write-Host "[4/4] Demarrage des serveurs..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Deux fenetres de terminal vont s'ouvrir:" -ForegroundColor White
Write-Host "  1. Terminal BACKEND (port 3001)" -ForegroundColor Green
Write-Host "  2. Terminal FRONTEND (port 3000)" -ForegroundColor Green
Write-Host ""
Write-Host "NE FERMEZ PAS CES FENETRES pendant le developpement" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour arreter les serveurs: Ctrl+C dans chaque terminal" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Appuyez sur Entree pour continuer"

# Démarrer le backend dans une nouvelle fenêtre PowerShell
$backendPath = Join-Path $PSScriptRoot "server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'AgriKonbit - Backend (Port 3001)' -ForegroundColor Green; npm run dev"

# Attendre 3 secondes pour que le backend démarre
Write-Host "Demarrage du backend..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Démarrer le frontend dans une nouvelle fenêtre PowerShell
$frontendPath = Join-Path $PSScriptRoot "client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'AgriKonbit - Frontend (Port 3000)' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  SERVEURS DEMARRES" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:3001" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "API Docs: http://localhost:3001/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "Le navigateur devrait s'ouvrir automatiquement sur:" -ForegroundColor Yellow
Write-Host "http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Consultez DEMARRAGE_RAPIDE.md pour plus d'informations" -ForegroundColor White
Write-Host ""
Read-Host "Appuyez sur Entree pour fermer cette fenetre"
