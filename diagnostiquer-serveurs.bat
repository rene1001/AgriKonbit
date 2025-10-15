@echo off
echo ========================================
echo DIAGNOSTIC DES SERVEURS
echo ========================================
echo.

echo 1. Verification de Node.js...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js non trouve
    goto :end
)

echo 2. Verification de npm...
npm --version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm non trouve
    goto :end
)

echo 3. Verification du serveur backend...
cd /d C:\wamp64\www\AgriKonbit\server
if exist package.json (
    echo ✅ package.json trouve
    npm list --depth=0
) else (
    echo ❌ package.json non trouve dans server/
    goto :end
)

echo 4. Verification du client frontend...
cd /d C:\wamp64\www\AgriKonbit\client
if exist package.json (
    echo ✅ package.json trouve
    npm list --depth=0
) else (
    echo ❌ package.json non trouve dans client/
    goto :end
)

echo 5. Verification de MySQL...
mysql --version 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ MySQL disponible
) else (
    echo ❌ MySQL non disponible
    echo    Utilisez phpMyAdmin: http://localhost/phpmyadmin
)

echo 6. Ports utilises...
netstat -ano | findstr :300
echo.

echo 7. Processus Node.js...
tasklist | findstr node.exe
echo.

echo ========================================
echo DIAGNOSTIC TERMINE
echo ========================================
echo.

echo Pour demarrer les serveurs:
echo 1. Terminal 1: cd C:\wamp64\www\AgriKonbit\server && npm start
echo 2. Terminal 2: cd C:\wamp64\www\AgriKonbit\client && npm start
echo.

pause

:end
