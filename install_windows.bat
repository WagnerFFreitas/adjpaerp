@echo off
REM =====================================================
REM ADJPA ERP - Instalação Automática (Windows)
REM =====================================================

echo.
echo =====================================================
echo   ADJPA ERP - Instalacao Automatica PostgreSQL
echo =====================================================
echo.

REM Verificar se está rodando como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERRO: Execute este script como Administrador!
    echo Clique com botao direito e selecione "Executar como administrador"
    pause
    exit /b 1
)

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
set MIGRATION_DIR=%~dp0migration

REM Verificar se PostgreSQL está instalado
if not exist "%PG_BIN%\psql.exe" (
    echo.
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
    echo Verifique se:
    echo   1. O PostgreSQL esta rodando
    echo   2. A senha esta correta
    echo   3. O usuario postgres existe
    echo.
    pause
    exit /b 1
)

echo [OK] Conexao estabelecida
echo.

REM Executar migrations
echo =====================================================
echo Executando migrations...
echo =====================================================
echo.

echo [1/5] Criando banco de dados...
"%PG_BIN%\psql.exe" -U postgres -f "%MIGRATION_DIR%\01_create_database.sql"
if %errorLevel% neq 0 (
    echo ERRO ao criar banco de dados!
    pause
    exit /b 1
)
echo [OK] Banco criado
echo.

echo [2/5] Criando schema...
"%PG_BIN%\psql.exe" -U postgres -d adjpa_erp -f "%MIGRATION_DIR%\02_create_schema.sql"
if %errorLevel% neq 0 (
    echo ERRO ao criar schema!
    pause
    exit /b 1
)
echo [OK] Schema criado
echo.

echo [3/5] Criando funcoes e triggers...
"%PG_BIN%\psql.exe" -U postgres -d adjpa_erp -f "%MIGRATION_DIR%\03_create_functions.sql"
if %errorLevel% neq 0 (
    echo ERRO ao criar funcoes!
    pause
    exit /b 1
)
echo [OK] Funcoes criadas
echo.

echo [4/5] Inserindo dados iniciais...
"%PG_BIN%\psql.exe" -U postgres -d adjpa_erp -f "%MIGRATION_DIR%\04_insert_initial_data.sql"
if %errorLevel% neq 0 (
    echo ERRO ao inserir dados!
    pause
    exit /b 1
)
echo [OK] Dados inseridos
echo.

echo [5/5] Verificando instalacao...
"%PG_BIN%\psql.exe" -U postgres -d adjpa_erp -f "%MIGRATION_DIR%\05_verify_installation.sql"
echo.

REM Configurar firewall
echo =====================================================
echo Configurando firewall...
echo =====================================================
echo.

netsh advfirewall firewall show rule name="PostgreSQL" >nul 2>&1
if %errorLevel% neq 0 (
    echo Adicionando regra de firewall para PostgreSQL...
    netsh advfirewall firewall add rule name="PostgreSQL" dir=in action=allow protocol=TCP localport=5432
    echo [OK] Regra adicionada
) else (
    echo [OK] Regra ja existe
)
echo.

REM Criar atalho para backup
echo =====================================================
echo Configurando backup...
echo =====================================================
echo.

set BACKUP_DIR=%~dp0backup
if not exist "%BACKUP_DIR%\backup_daily.bat" (
    echo AVISO: Script de backup nao encontrado!
) else (
    echo Script de backup disponivel em:
    echo %BACKUP_DIR%\backup_daily.bat
    echo.
    echo Para agendar backup automatico:
    echo   1. Abra o Agendador de Tarefas
    echo   2. Crie uma nova tarefa basica
    echo   3. Configure para executar diariamente
    echo   4. Selecione o arquivo backup_daily.bat
)
echo.

REM Resumo
echo =====================================================
echo INSTALACAO CONCLUIDA COM SUCESSO!
echo =====================================================
echo.
echo Credenciais de acesso:
echo   Email: admin@adjpa.com
echo   Senha: Admin@123
echo.
echo IMPORTANTE:
echo   1. Altere a senha apos o primeiro login
echo   2. Configure os dados da sua igreja
echo   3. Agende o backup automatico
echo.
echo Proximos passos:
echo   1. Configurar API (ver frontend/update_config.md)
echo   2. Atualizar frontend
echo   3. Testar conexao
echo.
echo Documentacao completa: lista.md
echo Instalacao rapida: INSTALACAO_RAPIDA.md
echo.

pause
