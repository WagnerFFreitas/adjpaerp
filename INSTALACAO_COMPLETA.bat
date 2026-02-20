@echo off
setlocal enabledelayedexpansion

echo.
echo =====================================================
echo   ADJPA ERP - Instalacao Automatica PostgreSQL
echo =====================================================
echo.

REM =====================================================
REM Detectar serviço PostgreSQL automaticamente
REM =====================================================

set PG_SERVICE=

for /f "tokens=2 delims= " %%s in ('sc query state^= all ^| findstr /I "postgresql-x64"') do (
    set PG_SERVICE=%%s
)

if not defined PG_SERVICE (
    echo PostgreSQL nao encontrado!
    echo.
    echo Por favor, instale o PostgreSQL 14 ou superior:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo Ou instale via Chocolatey:
    echo   choco install postgresql
    echo.
    pause
    exit /b 1
)

echo PostgreSQL detectado: %PG_SERVICE%
echo.

REM =====================================================
REM Verificar se o serviço está rodando
REM =====================================================

sc query %PG_SERVICE% | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo Iniciando servico PostgreSQL...
    net start %PG_SERVICE%
)

echo Servico ativo!
echo.

REM =====================================================
REM Criar banco
REM =====================================================

echo Criando banco de dados...

psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='adjpa_erp'" | find "1" >nul
if %errorlevel% neq 0 (
    psql -U postgres -c "CREATE DATABASE adjpa_erp;"
    echo Banco criado!
) else (
    echo Banco ja existe.
)

echo.

echo PostgreSQL pronto!
echo.

exit /b 0
