@echo off
chcp 65001 >nul

:: =====================================================
:: ADJPA ERP - BACKUP SEGURO E CRIPTOGRAFADO
:: =====================================================

echo.
echo ========================================
echo    ADJPA ERP - BACKUP SEGURO
echo ========================================
echo.

:: Configurações
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=adjpa_erp
set DB_USER=postgres
set DB_PASSWORD=123456
set PGPASSWORD=%DB_PASSWORD%

:: Diretórios
set BACKUP_DIR=C:\ADJPA_Backups
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%
set TIME=%time:~0,2%%time:~3,2%%time:~6,2%
set TIME=%TIME: =0%
set BACKUP_FILE=%BACKUP_DIR%\adjpa_backup_%DATE%_%TIME%.sql
set ENCRYPTED_FILE=%BACKUP_FILE%.enc

:: Criar diretório se não existir
if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
    echo Diretório de backup criado: %BACKUP_DIR%
)

echo Iniciando backup do banco %DB_NAME%...

:: Verificar se PostgreSQL está disponível
pg_dump --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: pg_dump não encontrado no PATH!
    echo Adicione o PostgreSQL ao PATH: C:\Program Files\PostgreSQL\18\bin
    pause
    exit /b 1
)

:: Testar conexão
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Não foi possível conectar ao banco de dados!
    echo Verifique se o PostgreSQL está rodando e as credenciais estão corretas.
    pause
    exit /b 1
)

:: Criar backup completo
echo Criando backup completo...
pg_dump -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% ^
  --verbose --clean --if-exists --create ^
  --format=plain --encoding=UTF8 ^
  --file="%BACKUP_FILE%"

if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar backup!
    pause
    exit /b 1
)

echo Backup criado: %BACKUP_FILE%

:: Verificar se OpenSSL está disponível para criptografia
openssl version >nul 2>&1
if %errorlevel% neq 0 (
    echo AVISO: OpenSSL não encontrado. Backup não será criptografado.
    echo Para criptografar, instale OpenSSL: https://slproweb.com/products/Win32OpenSSL.html
    goto :skip_encryption
)

:: Solicitar senha para criptografia
echo.
echo Para criptografar o backup, digite uma senha segura:
set /p ENCRYPT_PASSWORD="Senha de criptografia: "

if "%ENCRYPT_PASSWORD%"=="" (
    echo Senha não fornecida. Backup não será criptografado.
    goto :skip_encryption
)

:: Criptografar backup
echo Criptografando backup...
openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 ^
  -in "%BACKUP_FILE%" -out "%ENCRYPTED_FILE%" ^
  -pass pass:"%ENCRYPT_PASSWORD%"

if %errorlevel% neq 0 (
    echo ERRO: Falha ao criptografar backup!
    goto :skip_encryption
)

:: Remover arquivo não criptografado
del "%BACKUP_FILE%"
echo Backup criptografado criado: %ENCRYPTED_FILE%

:: Limpar variável da senha
set ENCRYPT_PASSWORD=

goto :cleanup

:skip_encryption
echo Backup não criptografado mantido: %BACKUP_FILE%

:cleanup
:: Limpar backups antigos (manter apenas 30 dias)
echo.
echo Limpando backups antigos (mais de 30 dias)...
forfiles /p "%BACKUP_DIR%" /s /m adjpa_backup_*.* /d -30 /c "cmd /c del @path" 2>nul
if %errorlevel% equ 0 (
    echo Backups antigos removidos.
) else (
    echo Nenhum backup antigo encontrado para remoção.
)

:: Estatísticas do backup
echo.
echo ========================================
echo    BACKUP CONCLUÍDO COM SUCESSO!
echo ========================================
echo.
echo Data/Hora: %date% %time%
echo Banco: %DB_NAME%
echo Diretório: %BACKUP_DIR%

if exist "%ENCRYPTED_FILE%" (
    echo Arquivo: %ENCRYPTED_FILE%
    echo Status: Criptografado com AES-256
    for %%A in ("%ENCRYPTED_FILE%") do echo Tamanho: %%~zA bytes
) else (
    echo Arquivo: %BACKUP_FILE%
    echo Status: Não criptografado
    for %%A in ("%BACKUP_FILE%") do echo Tamanho: %%~zA bytes
)

echo.
echo IMPORTANTE:
echo - Guarde a senha de criptografia em local seguro
echo - Teste a restauração periodicamente
echo - Mantenha backups em local externo
echo.

:: Log do backup
echo %date% %time% - Backup realizado com sucesso >> "%BACKUP_DIR%\backup.log"

pause