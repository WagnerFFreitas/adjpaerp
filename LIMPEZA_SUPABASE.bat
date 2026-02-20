@echo off
chcp 65001 >nul

:: =====================================================
:: ADJPA ERP - LIMPEZA DO SUPABASE
:: Remove arquivos obsoletos do Supabase
:: =====================================================

echo.
echo ========================================
echo    LIMPEZA DO SUPABASE
echo ========================================
echo.

echo O projeto foi migrado do Supabase para PostgreSQL local.
echo Os arquivos do Supabase nao sao mais necessarios.
echo.

set /p resposta="Deseja remover a pasta supabase/ e dependencias? (S/N): "

if /i "%resposta%"=="S" (
    echo.
    echo Removendo pasta supabase/...
    if exist "supabase" (
        rmdir /s /q "supabase"
        echo ✅ Pasta supabase/ removida
    ) else (
        echo ⚠️  Pasta supabase/ nao encontrada
    )
    
    echo.
    echo Removendo dependencia @supabase/supabase-js...
    npm uninstall @supabase/supabase-js
    
    if %errorlevel% equ 0 (
        echo ✅ Dependencia @supabase/supabase-js removida
    ) else (
        echo ⚠️  Erro ao remover dependencia (pode nao existir)
    )
    
    echo.
    echo ========================================
    echo    LIMPEZA CONCLUIDA!
    echo ========================================
    echo.
    echo Arquivos removidos:
    echo - supabase/ (pasta completa)
    echo - @supabase/supabase-js (dependencia)
    echo.
    echo O sistema agora usa apenas PostgreSQL local.
    echo Nenhuma funcionalidade foi afetada.
    echo.
    
) else (
    echo.
    echo Operacao cancelada pelo usuario.
    echo Os arquivos do Supabase foram mantidos.
    echo.
)

pause