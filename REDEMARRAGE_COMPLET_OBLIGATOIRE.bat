@echo off
echo ========================================
echo REDEMARRAGE COMPLET DU SERVEUR CLIENT
echo ========================================
echo.

cd client

echo Etape 1: Nettoyage du cache npm...
call npm cache clean --force
echo.

echo Etape 2: Suppression du dossier node_modules/.cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo Cache supprime avec succes
) else (
    echo Pas de cache a supprimer
)
echo.

echo Etape 3: Demarrage du serveur...
echo.
echo IMPORTANT: Apres le demarrage, appuyez sur Ctrl+Shift+R dans le navigateur
echo pour vider le cache du navigateur !
echo.
call npm start
