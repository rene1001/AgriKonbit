@echo off
echo.
echo ========================================
echo   REDEMARRAGE DES SERVEURS
echo ========================================
echo.

echo Arret de tous les processus Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ========================================
echo   Demarrage du BACKEND
echo ========================================
echo.

cd server
start "AgriKonbit Backend" cmd /k "npm start"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Demarrage du FRONTEND
echo ========================================
echo.

cd ..\client
start "AgriKonbit Frontend" cmd /k "npm start"

echo.
echo ========================================
echo   SERVEURS DEMARRES !
echo ========================================
echo.
echo Backend : Terminal "AgriKonbit Backend"
echo Frontend : Terminal "AgriKonbit Frontend"
echo.
echo Page web : http://localhost:3000/profile
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul
