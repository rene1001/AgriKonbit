@echo off
echo ========================================
echo  AGRIKONBIT - SUITE DE TESTS COMPLETE
echo ========================================
echo.

echo [1/11] Installation des dependances...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Installation des dependances echouee
    pause
    exit /b 1
)

echo.
echo [2/11] Installation Playwright...
call npm run e2e:install
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Installation Playwright echouee
    pause
    exit /b 1
)

echo.
echo [3/11] Tests Fonctionnels...
call npm run test:functional
set FUNCTIONAL_RESULT=%ERRORLEVEL%

echo.
echo [4/11] Tests de Performance...
call npm run test:performance
set PERFORMANCE_RESULT=%ERRORLEVEL%

echo.
echo [5/11] Tests de Securite...
call npm run test:security
set SECURITY_RESULT=%ERRORLEVEL%

echo.
echo [6/11] Tests UI/UX...
call npm run test:ui
set UI_RESULT=%ERRORLEVEL%

echo.
echo [7/11] Tests SEO...
call npm run test:seo
set SEO_RESULT=%ERRORLEVEL%

echo.
echo [8/11] Tests Accessibilite...
call npm run test:accessibility
set ACCESSIBILITY_RESULT=%ERRORLEVEL%

echo.
echo [9/11] Tests Compatibilite...
call npm run test:compatibility
set COMPATIBILITY_RESULT=%ERRORLEVEL%

echo.
echo [10/11] Tests Integration...
call npm run test:integration
set INTEGRATION_RESULT=%ERRORLEVEL%

echo.
echo [11/11] Tests Regression...
call npm run test:regression
set REGRESSION_RESULT=%ERRORLEVEL%

echo.
echo ========================================
echo  RESUME DES TESTS
echo ========================================
echo.
echo Tests Fonctionnels:    %FUNCTIONAL_RESULT%
echo Tests Performance:     %PERFORMANCE_RESULT%
echo Tests Securite:        %SECURITY_RESULT%
echo Tests UI/UX:           %UI_RESULT%
echo Tests SEO:             %SEO_RESULT%
echo Tests Accessibilite:   %ACCESSIBILITY_RESULT%
echo Tests Compatibilite:   %COMPATIBILITY_RESULT%
echo Tests Integration:     %INTEGRATION_RESULT%
echo Tests Regression:      %REGRESSION_RESULT%
echo.

echo Generation du rapport...
call npm run test:report

echo.
echo ========================================
echo  TESTS TERMINES
echo ========================================
echo.
echo Consultez RAPPORT_TESTS_FINAL.md pour les details
echo.

pause
