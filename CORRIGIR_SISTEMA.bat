@echo off
REM =====================================================
REM ADJPA ERP - Correção do Sistema
REM =====================================================

echo.
echo =====================================================
echo   ADJPA ERP - Corrigindo Sistema
echo =====================================================
echo.

REM Configurações
set PG_BIN=C:\Program Files\PostgreSQL\18\bin
if not exist "%PG_BIN%\psql.exe" (
    set PG_BIN=C:\Program Files\PostgreSQL\17\bin
)
if not exist "%PG_BIN%\psql.exe" (
    set PG_BIN=C:\Program Files\PostgreSQL\16\bin
)
if not exist "%PG_BIN%\psql.exe" (
    set PG_BIN=C:\Program Files\PostgreSQL\15\bin
)
if not exist "%PG_BIN%\psql.exe" (
    set PG_BIN=C:\Program Files\PostgreSQL\14\bin
)

REM Verificar se PostgreSQL está instalado
if not exist "%PG_BIN%\psql.exe" (
    echo.
    echo PostgreSQL nao encontrado!
    pause
    exit /b 1
)

echo [OK] PostgreSQL encontrado
echo.

REM Solicitar senha do postgres
set /p POSTGRES_PASSWORD=Digite a senha do usuario postgres: 
echo.

REM Testar conexão
echo Testando conexao com PostgreSQL...
set PGPASSWORD=%POSTGRES_PASSWORD%
"%PG_BIN%\psql.exe" -U postgres -c "SELECT version();" >nul 2>&1

if %errorLevel% neq 0 (
    echo.
    echo ERRO: Nao foi possivel conectar ao PostgreSQL!
    pause
    exit /b 1
)

echo [OK] Conexao estabelecida
echo.

REM Executar correções
echo =====================================================
echo Executando correcoes do banco de dados...
echo =====================================================
echo.

"%PG_BIN%\psql.exe" -U postgres -f fix_database.sql

if %errorLevel% neq 0 (
    echo ERRO ao executar correcoes!
    pause
    exit /b 1
)

echo.
echo =====================================================
echo CORRECOES CONCLUIDAS COM SUCESSO!
echo =====================================================
echo.
echo Agora execute:
echo.
echo   1. Terminal 1 - API:
echo      cd api
echo      npm run dev
echo.
echo   2. Terminal 2 - Frontend:
echo      npm run dev
echo.
echo   3. Acesse: http://localhost:8080
echo.
echo Credenciais:
echo   admin@adjpa.com / Admin@123
echo   desenvolvedor@adjpa.com / dev@ecclesia_secure_2024
echo.

pause