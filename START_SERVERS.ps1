# Script PowerShell pour démarrer les serveurs AgriKonbit
# Usage: .\START_SERVERS.ps1

Write-Host "🚀 Démarrage des serveurs AgriKonbit..." -ForegroundColor Green
Write-Host ""

# Vérifier si les dossiers existent
if (-not (Test-Path ".\server")) {
    Write-Host "❌ Erreur: Le dossier 'server' n'existe pas!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".\client")) {
    Write-Host "❌ Erreur: Le dossier 'client' n'existe pas!" -ForegroundColor Red
    exit 1
}

# Fonction pour vérifier si un port est utilisé
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Vérifier les ports
Write-Host "🔍 Vérification des ports..." -ForegroundColor Yellow

if (Test-Port 3001) {
    Write-Host "⚠️  Le port 3001 est déjà utilisé!" -ForegroundColor Yellow
    $response = Read-Host "Voulez-vous tuer le processus? (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        $process = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force
            Write-Host "✅ Processus arrêté" -ForegroundColor Green
            Start-Sleep -Seconds 2
        }
    }
}

if (Test-Port 3000) {
    Write-Host "⚠️  Le port 3000 est déjà utilisé!" -ForegroundColor Yellow
    $response = Read-Host "Voulez-vous tuer le processus? (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        $process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force
            Write-Host "✅ Processus arrêté" -ForegroundColor Green
            Start-Sleep -Seconds 2
        }
    }
}

Write-Host ""
Write-Host "📦 Démarrage du serveur Backend (port 3001)..." -ForegroundColor Cyan

# Démarrer le backend dans une nouvelle fenêtre
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; Write-Host '🔧 Backend Server' -ForegroundColor Green; npm start"

Write-Host "⏳ Attente de 5 secondes pour que le backend démarre..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🌐 Démarrage du serveur Frontend (port 3000)..." -ForegroundColor Cyan

# Démarrer le frontend dans une nouvelle fenêtre
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; Write-Host '⚛️  Frontend Server' -ForegroundColor Blue; npm start"

Write-Host ""
Write-Host "✅ Les serveurs sont en cours de démarrage!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Informations:" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "   API Docs: http://localhost:3001/api-docs" -ForegroundColor Gray
Write-Host ""
Write-Host "⏳ Patientez quelques secondes pour que les serveurs démarrent complètement..." -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Astuce: Vérifiez les fenêtres PowerShell ouvertes pour voir les logs" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Ouverture du navigateur dans 10 secondes..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Ouvrir le navigateur
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✨ Terminé! Les serveurs sont démarrés." -ForegroundColor Green
Write-Host ""
Write-Host "Pour arrêter les serveurs, fermez les fenêtres PowerShell ou appuyez sur Ctrl+C dans chaque fenêtre." -ForegroundColor Gray
Write-Host ""
