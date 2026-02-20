@echo off
chcp 65001 >nul

:: =====================================================
:: ADJPA ERP - CRIACAO DO BANCO DE DADOS
:: Script para instalacao em maquinas novas
:: =====================================================

echo.
echo ========================================
echo    ADJPA ERP - CRIACAO DO BANCO
echo ========================================
echo.

:: Configuracoes do banco (mesmas do .env da API)
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=adjpa_erp
set DB_USER=postgres
set DB_PASSWORD=123456
set PGPASSWORD=%DB_PASSWORD%

echo Verificando PostgreSQL...

:: Verificar se PostgreSQL esta instalado
where psql >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: PostgreSQL nao encontrado!
    echo.
    echo Instale o PostgreSQL 18 e adicione ao PATH:
    echo https://www.postgresql.org/download/windows/
    echo.
    pause
    exit /b 1
)

echo PostgreSQL encontrado!

:: Testar conexao
echo Testando conexao...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT version();" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Nao foi possivel conectar!
    echo.
    echo Verifique se o PostgreSQL esta rodando e se a senha esta correta.
    echo Usuario: %DB_USER%
    echo Senha: %DB_PASSWORD%
    echo.
    pause
    exit /b 1
)

echo Conexao OK!

:: Verificar se arquivo de migration existe
if not exist "migration\01_create_database.sql" (
    echo ERRO: Arquivo migration\01_create_database.sql nao encontrado!
    echo.
    echo Certifique-se de executar este script na pasta raiz do projeto.
    pause
    exit /b 1
)

:: Executar script de criacao do banco
echo.
echo Executando script de criacao do banco...
echo.

psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -f "migration\01_create_database.sql"

if %errorlevel% neq 0 (
    echo.
    echo ERRO: Falha na criacao do banco!
    pause
    exit /b 1
)

:: Executar demais migrations se existirem
echo.
echo Executando migrations adicionais...

if exist "migration\02_create_schema.sql" (
    echo Executando schema principal...
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "migration\02_create_schema.sql"
)

if exist "migration\03_create_functions.sql" (
    echo Executando funcoes...
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "migration\03_create_functions.sql"
)

if exist "migration\04_insert_initial_data.sql" (
    echo Inserindo dados iniciais...
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "migration\04_insert_initial_data.sql"
)

if exist "migration\05_expand_members_ecclesiastical.sql" (
    echo Expandindo tabela de membros...
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "migration\05_expand_members_ecclesiastical.sql"
)

if exist "migration\06_security_tables.sql" (
    echo Criando tabelas de seguranca...
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "migration\06_security_tables.sql"
)

echo.
echo ========================================
echo    BANCO CRIADO COM SUCESSO!
echo ========================================
echo.
echo Banco: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo Usuario: %DB_USER%
echo.
echo Usuarios padrao:
echo - desenvolvedor@adjpa.com / dev@ecclesia_secure_2024
echo - admin@adjpa.com / Admin@123
echo.
echo Recursos de seguranca:
echo - Protecao contra SQL injection
echo - Logs de auditoria e seguranca
echo - Bloqueio automatico de IPs suspeitos
echo - Criptografia de senhas com bcrypt
echo - Monitoramento de tentativas de login
echo.
echo Proximos passos:
echo 1. Execute: START_SISTEMA.bat
echo 2. Acesse: http://localhost:8080
echo 3. Configure backup automatico com: backup_seguro.bat
echo.
pause