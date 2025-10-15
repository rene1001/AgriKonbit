# PowerShell script to restart the backend server

Write-Host "🔄 Restarting Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Find and kill Node process on port 3001
Write-Host "📍 Finding Node process on port 3001..." -ForegroundColor Yellow
$tcpConnection = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
if ($tcpConnection) {
    $processId = $tcpConnection.OwningProcess
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    
    if ($process) {
        Write-Host "⚠️  Found process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Yellow
        Write-Host "   Stopping process..." -ForegroundColor Yellow
        Stop-Process -Id $processId -Force
        Start-Sleep -Seconds 2
        Write-Host "✅ Process stopped" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  No process found on port 3001" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🚀 Starting backend server..." -ForegroundColor Cyan
Write-Host "   Location: server\" -ForegroundColor Gray
Write-Host "   Command: npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  The server will start in a new terminal window." -ForegroundColor Yellow
Write-Host "   Press Ctrl+C in that window to stop the server." -ForegroundColor Yellow
Write-Host ""

# Start the server in a new terminal
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; Write-Host '🚀 Starting AgriKonbit Backend Server...' -ForegroundColor Green; npm start"

Write-Host "✅ Server startup initiated!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Wait for server to start (about 5-10 seconds)" -ForegroundColor White
Write-Host "   2. Run verification: node test-settings-direct.js" -ForegroundColor White
Write-Host "   3. Check your browser - the 500 errors should be gone!" -ForegroundColor White
Write-Host ""
