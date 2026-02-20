@echo off
echo =====================================================
echo ADJPA ERP - Teste de Login
echo =====================================================
echo.

echo Testando conexao com a API...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3001/api/health' -Method GET | Format-Table -AutoSize } catch { Write-Host 'ERRO: API nao esta rodando!' -ForegroundColor Red }"

echo.
echo Testando login do Administrador...
powershell -Command "try { $body = @{email='admin@adjpa.com'; password='Admin@123'} | ConvertTo-Json; $result = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $body -ContentType 'application/json'; if($result.success) { Write-Host 'LOGIN ADMIN: SUCESSO!' -ForegroundColor Green } else { Write-Host 'LOGIN ADMIN: FALHOU!' -ForegroundColor Red } } catch { Write-Host 'LOGIN ADMIN: ERRO!' -ForegroundColor Red; Write-Host $_.Exception.Message }"

echo.
echo Testando login do Desenvolvedor...
powershell -Command "try { $body = @{email='desenvolvedor@adjpa.com'; password='dev@ecclesia_secure_2024'} | ConvertTo-Json; $result = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $body -ContentType 'application/json'; if($result.success) { Write-Host 'LOGIN DESENVOLVEDOR: SUCESSO!' -ForegroundColor Green } else { Write-Host 'LOGIN DESENVOLVEDOR: FALHOU!' -ForegroundColor Red } } catch { Write-Host 'LOGIN DESENVOLVEDOR: ERRO!' -ForegroundColor Red; Write-Host $_.Exception.Message }"

echo.
echo =====================================================
echo Teste concluido!
echo =====================================================
echo.
echo Se todos os testes passaram, o sistema esta funcionando!
echo Agora voce pode acessar: http://localhost:8080
echo.
echo Credenciais:
echo   Admin: admin@adjpa.com / Admin@123
echo   Dev:   desenvolvedor@adjpa.com / dev@ecclesia_secure_2024
echo.
pause