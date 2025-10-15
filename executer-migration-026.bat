@echo off
echo ========================================
echo Execution de la migration 026
echo ========================================
echo.

cd /d "%~dp0"

echo Execution de la migration...
mysql -u root -p agrikonbit < migrations\026_fix_platform_settings.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration executee avec succes!
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ERREUR lors de l'execution de la migration
    echo ========================================
)

echo.
pause
