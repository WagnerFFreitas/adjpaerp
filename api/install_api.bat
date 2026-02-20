@echo off
REM =====================================================
REM ADJPA ERP API - Instalação
REM =====================================================

echo.
echo =====================================================
echo   ADJPA ERP API - Instalacao
echo =====================================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js 18 ou superior:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
node --version
echo.

REM Verificar se npm está instalado
where npm >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo npm nao encontrado!
    echo.
    pause
    exit /b 1
)

echo [OK] npm encontrado
npm --version
echo.

REM Criar arquivo .env se não existir
if not exist ".env" (
    echo Criando arquivo .env...
    copy .env.example .env
    echo [OK] Arquivo .env criado
    echo.
    echo IMPORTANTE: Edite o arquivo .env com suas configuracoes!
    echo.
) else (
    echo [OK] Arquivo .env ja existe
    echo.
)

REM Instalar dependências
echo =====================================================
echo Instalando dependencias...
echo =====================================================
echo.

call npm install

if %errorLevel% neq 0 (
    echo.
    echo ERRO ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo =====================================================
echo INSTALACAO CONCLUIDA COM SUCESSO!
echo =====================================================
echo.
echo Para iniciar a API:
echo.
echo   Desenvolvimento (com hot-reload):
echo     npm run dev
echo.
echo   Producao:
echo     npm run start:prod
echo.
echo A API estara disponivel em: http://localhost:3001
echo.
echo Documentacao: README.md
echo.

pause
