@echo off
REM =====================================================
REM ADJPA ERP - Script de Backup Diário (Windows)
REM =====================================================

REM Configurações
set BACKUP_DIR=C:\Backups\ADJPA
set DB_NAME=adjpa_erp
set DB_USER=adjpa_user
set PGPASSWORD=SenhaSeg123!
set PG_BIN=C:\Program Files\PostgreSQL\14\bin
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE=%DATE: =0%
set BACKUP_FILE=%BACKUP_DIR%\adjpa_erp_%DATE%.sql
set LOG_FILE=%BACKUP_DIR%\backup.log

REM Criar diretório se não existir
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

REM Log de início
echo [%date% %time%] Iniciando backup do banco de dados... >> "%LOG_FILE%"

REM Fazer backup
"%PG_BIN%\pg_dump.exe" -U %DB_USER% -d %DB_NAME% -F c -f "%BACKUP_FILE%"

REM Verificar se backup foi criado
if exist "%BACKUP_FILE%" (
    echo [%date% %time%] Backup criado com sucesso: %BACKUP_FILE% >> "%LOG_FILE%"
) else (
    echo [%date% %time%] ERRO: Falha ao criar backup! >> "%LOG_FILE%"
    exit /b 1
)

REM Remover backups antigos (mais de 30 dias)
forfiles /P "%BACKUP_DIR%" /M adjpa_erp_*.sql /D -30 /C "cmd /c del @path" 2>nul

echo [%date% %time%] Backup concluído com sucesso! >> "%LOG_FILE%"

REM Opcional: Copiar para rede
REM xcopy "%BACKUP_FILE%" "\\servidor-backup\backups\adjpa\" /Y

exit /b 0
