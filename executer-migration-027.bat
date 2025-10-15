@echo off
echo ========================================
echo Migration 027: Tresorerie de la Plateforme
echo ========================================
echo.

cd /d "%~dp0"

echo Execution de la migration...
mysql -u root -p agrikonbit < migrations\027_platform_treasury.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration executee avec succes!
    echo ========================================
    echo.
    echo La tresorerie de la plateforme est maintenant configuree.
    echo Vous pouvez y acceder via: /admin/treasury
) else (
    echo.
    echo ========================================
    echo ERREUR lors de l'execution de la migration
    echo ========================================
)

echo.
pause
