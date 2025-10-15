@echo off
echo ========================================
echo VERIFICATION DU SERVEUR BACKEND
echo ========================================
echo.

echo Test 1: Port 3001 utilise...
netstat -ano | findstr :3001
if %ERRORLEVEL% EQU 0 (
    echo ✅ Port 3001 est utilise (probablement par le serveur)
) else (
    echo ❌ Port 3001 n'est pas utilise
)

echo.
echo Test 2: Test de connexion...
curl -s -o nul -w "%%{http_code}" http://localhost:3001/health
if %ERRORLEVEL% EQU 0 (
    echo ✅ Serveur backend repond
) else (
    echo ❌ Serveur backend ne repond pas
)

echo.
echo Test 3: Processus Node.js...
tasklist | findstr node.exe

echo.
echo ========================================
echo Si le serveur ne repond pas:
echo 1. Ouvrez un terminal
echo 2. cd C:\wamp64\www\AgriKonbit\server
echo 3. npm start
echo ========================================
echo.

pause
