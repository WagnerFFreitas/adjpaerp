@echo off
REM =====================================================
REM ADJPA ERP - Iniciar Sistema Completo
REM =====================================================

echo.
echo =====================================================
echo   ADJPA ERP - Iniciando Sistema Completo
echo =====================================================
echo.

echo Abrindo 2 terminais:
echo   1. API (Backend)
echo   2. Frontend
echo.

REM Iniciar API em nova janela
start "ADJPA ERP - API" cmd /k "cd /d %~dp0 && START_API.bat"

REM Aguardar 3 segundos
timeout /t 3 /nobreak >nul

REM Iniciar Frontend em nova janela
start "ADJPA ERP - Frontend" cmd /k "cd /d %~dp0 && START_FRONTEND.bat"

echo.
echo Sistema iniciado!
echo.
echo API: http://localhost:3001
echo Frontend: http://localhost:8080
echo.
echo CREDENCIAIS:
echo.
echo Desenvolvedor (Acesso Total):
echo   Email: desenvolvedor@adjpa.com
echo   Senha: dev@ecclesia_secure_2024
echo.
echo Administrador Inicial:
echo   Email: admin@adjpa.com
echo   Senha: admin123
echo   IMPORTANTE: Altere apos primeiro login!
echo.

pause
