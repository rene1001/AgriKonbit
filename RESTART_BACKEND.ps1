# Script pour redémarrer uniquement le serveur backend
Write-Host "🔄 Redémarrage du serveur backend..." -ForegroundColor Cyan

# Arrêter les processus Node.js qui tournent dans le dossier server
Write-Host "⏹️  Arrêt des processus backend existants..." -ForegroundColor Yellow

Get-Process | Where-Object {
    $_.ProcessName -eq "node" -and 
    $_.Path -and 
    $_.MainModule.FileName -match "AgriKonbit\\server"
} | ForEach-Object {
    Write-Host "   Arrêt du processus $($_.Id)..." -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

# Démarrer le serveur backend
Write-Host "🚀 Démarrage du serveur backend..." -ForegroundColor Green

$serverPath = Join-Path $PSScriptRoot "server"

if (Test-Path $serverPath) {
    Set-Location $serverPath
    
    # Vérifier si package.json existe
    if (Test-Path "package.json") {
        Write-Host "📦 Démarrage avec npm..." -ForegroundColor Cyan
        
        # Démarrer en arrière-plan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverPath'; npm start" -WindowStyle Normal
        
        Write-Host ""
        Write-Host "✅ Serveur backend en cours de démarrage!" -ForegroundColor Green
        Write-Host "📍 Port: 3001" -ForegroundColor Cyan
        Write-Host "📚 Documentation: http://localhost:3001/api-docs" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "⏳ Attendez quelques secondes que le serveur démarre complètement..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "💡 Vérifiez la fenêtre du serveur pour confirmer:" -ForegroundColor White
        Write-Host "   ✅ Database connected successfully" -ForegroundColor Gray
        Write-Host "   🚀 Server running on port 3001" -ForegroundColor Gray
        Write-Host ""
        Write-Host "🧪 Ensuite, testez la suppression de notifications dans le navigateur!" -ForegroundColor Magenta
    } else {
        Write-Host "❌ Erreur: package.json introuvable dans $serverPath" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Erreur: Dossier server introuvable" -ForegroundColor Red
}

Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenêtre..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
