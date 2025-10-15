@echo off
echo ============================================================
echo   AGRIKONBIT - DEMARRAGE ENVIRONNEMENT DE DEVELOPPEMENT
echo ============================================================
echo.

REM Vérifier que nous sommes dans le bon répertoire
if not exist "server" (
    echo [ERREUR] Repertoire server non trouve
    echo Assurez-vous d'executer ce script depuis le repertoire racine AgriKonbit
    pause
    exit /b 1
)

if not exist "client" (
    echo [ERREUR] Repertoire client non trouve
    echo Assurez-vous d'executer ce script depuis le repertoire racine AgriKonbit
    pause
    exit /b 1
)

echo [1/4] Verification de la base de donnees...
cd migrations
call node verify-fixes.js
if errorlevel 1 (
    echo.
    echo [ERREUR] La verification de la base de donnees a echoue
    echo Veuillez executer d'abord: node migrations/run-fixes.js
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Verification des dependances backend...
cd server
if not exist "node_modules" (
    echo Installation des dependances backend...
    call npm install
)
cd ..

echo.
echo [3/4] Verification des dependances frontend...
cd client
if not exist "node_modules" (
    echo Installation des dependances frontend...
    call npm install
)
cd ..

echo.
echo [4/4] Demarrage des serveurs...
echo.
echo ============================================================
echo   INSTRUCTIONS
echo ============================================================
echo.
echo Deux fenetres de terminal vont s'ouvrir:
echo   1. Terminal BACKEND (port 3001)
echo   2. Terminal FRONTEND (port 3000)
echo.
echo NE FERMEZ PAS CES FENETRES pendant le developpement
echo.
echo Pour arreter les serveurs: Ctrl+C dans chaque terminal
echo.
echo ============================================================
echo.
pause

REM Démarrer le backend dans une nouvelle fenêtre
start "AgriKonbit - Backend (Port 3001)" cmd /k "cd /d %~dp0server && npm run dev"

REM Attendre 3 secondes pour que le backend démarre
timeout /t 3 /nobreak > nul

REM Démarrer le frontend dans une nouvelle fenêtre
start "AgriKonbit - Frontend (Port 3000)" cmd /k "cd /d %~dp0client && npm start"

echo.
echo ============================================================
echo   SERVEURS DEMARRES
echo ============================================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:3001/api-docs
echo.
echo Le navigateur devrait s'ouvrir automatiquement sur:
echo http://localhost:3000
echo.
echo ============================================================
echo.
echo Consultez DEMARRAGE_RAPIDE.md pour plus d'informations
echo.
pause
