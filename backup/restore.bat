@echo off
REM =====================================================
REM ADJPA ERP - Script de Restauração (Windows)
REM =====================================================

if "%1"=="" (
    echo Uso: restore.bat caminho_do_backup.sql
    echo Exemplo: restore.bat C:\Backups\ADJPA\adjpa_erp_20240216_120000.sql
    exit /b 1
)

set BACKUP_FILE=%1
set DB_NAME=adjpa_erp
set DB_USER=adjpa_user
set PGPASSWORD=SenhaSeg123!
set PG_BIN=C:\Program Files\PostgreSQL\14\bin

REM Verificar se arquivo existe
if not exist "%BACKUP_FILE%" (
    echo ERRO: Arquivo de backup não encontrado: %BACKUP_FILE%
    exit /b 1
)

echo =====================================================
echo RESTAURAÇÃO DO BANCO DE DADOS
echo =====================================================
echo.
echo Arquivo: %BACKUP_FILE%
echo Banco: %DB_NAME%
echo.
echo ATENÇÃO: Esta operação irá SOBRESCREVER todos os dados!
echo.
set /p CONFIRM=Deseja continuar? (S/N): 

if /i not "%CONFIRM%"=="S" (
    echo Operação cancelada.
    exit /b 0
)

echo.
echo Desconectando usuários...
"%PG_BIN%\psql.exe" -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='%DB_NAME%' AND pid <> pg_backend_pid();"

echo Removendo banco existente...
"%PG_BIN%\dropdb.exe" -U postgres --if-exists %DB_NAME%

echo Criando novo banco...
"%PG_BIN%\createdb.exe" -U postgres %DB_NAME%

echo Restaurando backup...
"%PG_BIN%\pg_restore.exe" -U %DB_USER% -d %DB_NAME% -v "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =====================================================
    echo Restauração concluída com sucesso!
    echo =====================================================
) else (
    echo.
    echo =====================================================
    echo ERRO na restauração!
    echo =====================================================
    exit /b 1
)

exit /b 0
