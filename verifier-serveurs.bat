@echo off
echo ========================================
echo VERIFICATION DES SERVEURS REDÉMARRÉS
echo ========================================
echo.

echo 1. Test Backend (Port 3001)...
curl -s -o nul -w "%%{http_code}" http://localhost:3001/health
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend OK
) else (
    echo ❌ Backend ERREUR
)

echo.
echo 2. Test Frontend (Port 3000)...
curl -s -o nul -w "%%{http_code}" http://localhost:3000
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend OK
) else (
    echo ❌ Frontend ERREUR
)

echo.
echo 3. Ports actifs...
netstat -ano | findstr :300

echo.
echo ========================================
echo RESULTATS:
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Pour acceder au dashboard admin:
echo http://localhost:3000/admin
echo ========================================
echo.

pause
