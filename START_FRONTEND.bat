@echo off
REM =====================================================
REM ADJPA ERP - Iniciar Frontend
REM =====================================================

echo.
echo =====================================================
echo   Iniciando ADJPA ERP Frontend...
echo =====================================================
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo Dependencias nao instaladas!
    echo Executando npm install...
    call npm install
)

REM Verificar se .env.local existe
if not exist ".env.local" (
    echo Arquivo .env.local nao encontrado!
    echo Criando arquivo padrao...
    echo VITE_API_URL=http://localhost:3001/api > .env.local
    echo VITE_APP_NAME=ADJPA ERP >> .env.local
    echo VITE_APP_VERSION=1.0.0 >> .env.local
)

echo.
echo Frontend iniciando...
echo Acesse: http://localhost:8080
echo.
echo Pressione Ctrl+C para parar
echo.

call npm run dev
