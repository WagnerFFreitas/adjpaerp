@echo off
REM =====================================================
REM ADJPA ERP - Iniciar API
REM =====================================================

echo.
echo =====================================================
echo   Iniciando ADJPA ERP API...
echo =====================================================
echo.

cd api

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo Dependencias nao instaladas!
    echo Executando npm install...
    call npm install
)

REM Verificar se .env existe
if not exist ".env" (
    echo Arquivo .env nao encontrado!
    echo Criando a partir do .env.example...
    copy .env.example .env
)

echo.
echo API iniciando em modo desenvolvimento...
echo Acesse: http://localhost:3001
echo Health check: http://localhost:3001/api/health
echo.
echo Pressione Ctrl+C para parar
echo.

call npm run dev
