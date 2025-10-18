@echo off
echo ========================================
echo   TEST DES TRADUCTIONS - AgriKonbit
echo ========================================
echo.
echo 1. Verification des serveurs...
echo.

tasklist /FI "IMAGENAME eq node.exe" /NH | find /I "node.exe" >nul
if %errorlevel%==0 (
    echo [OK] Serveurs Node.js en cours d'execution
) else (
    echo [ERREUR] Aucun serveur Node.js detecte
    echo Veuillez demarrer les serveurs avec demarrer-serveurs.bat
    pause
    exit /b 1
)

echo.
echo 2. Ouverture des pages de test...
echo.

timeout /t 2 >nul

echo [1/10] Ouverture de la page d'accueil...
start http://localhost:3000

timeout /t 2 >nul

echo [2/10] Ouverture de la page About...
start http://localhost:3000/about

timeout /t 2 >nul

echo [3/10] Ouverture de la page Projects...
start http://localhost:3000/projects

timeout /t 2 >nul

echo [4/10] Ouverture de la page Marketplace...
start http://localhost:3000/marketplace

timeout /t 2 >nul

echo [5/10] Ouverture de la page Cart...
start http://localhost:3000/cart

timeout /t 2 >nul

echo [6/10] Ouverture de la page Checkout...
start http://localhost:3000/checkout

timeout /t 2 >nul

echo [7/10] Ouverture du Dashboard...
start http://localhost:3000/dashboard

timeout /t 2 >nul

echo [8/10] Ouverture du Profile...
start http://localhost:3000/profile

timeout /t 2 >nul

echo [9/10] Ouverture de la carte des projets...
start http://localhost:3000/map

timeout /t 2 >nul

echo [10/10] Ouverture de la page 404...
start http://localhost:3000/page-inexistante-404

echo.
echo ========================================
echo   TESTS LANCES AVEC SUCCES
echo ========================================
echo.
echo Instructions:
echo 1. Testez le changement de langue (FR / EN / ES) dans le header
echo 2. Verifiez que tous les textes changent
echo 3. Rechargez la page (F5) pour verifier la persistance
echo 4. Consultez GUIDE_TESTS_TRADUCTIONS.md pour plus de details
echo.
echo Appuyez sur F12 pour ouvrir la console et verifier:
echo - Aucune erreur JavaScript
echo - Aucun avertissement i18n
echo.
pause
