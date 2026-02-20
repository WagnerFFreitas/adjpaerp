# =====================================================
# ADJPA ERP - Teste de Login
# =====================================================

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "ADJPA ERP - Teste de Login" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Testando conexao com a API..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri 'http://localhost:3001/api/health' -Method GET
    Write-Host "API STATUS: $($health.status)" -ForegroundColor Green
    Write-Host "SERVICO: $($health.service)" -ForegroundColor Green
} catch {
    Write-Host "ERRO: API nao esta rodando!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Testando login do Administrador..." -ForegroundColor Yellow
try {
    $body = @{email='admin@adjpa.com'; password='Admin@123'} | ConvertTo-Json
    $result = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
    if($result.success) {
        Write-Host "LOGIN ADMIN: SUCESSO!" -ForegroundColor Green
        Write-Host "Usuario: $($result.user.name)" -ForegroundColor Green
        Write-Host "Email: $($result.user.email)" -ForegroundColor Green
        Write-Host "Roles: $($result.user.roles -join ', ')" -ForegroundColor Green
    } else {
        Write-Host "LOGIN ADMIN: FALHOU!" -ForegroundColor Red
    }
} catch {
    Write-Host "LOGIN ADMIN: ERRO!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Testando login do Desenvolvedor..." -ForegroundColor Yellow
try {
    $body = @{email='desenvolvedor@adjpa.com'; password='dev@ecclesia_secure_2024'} | ConvertTo-Json
    $result = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $body -ContentType 'application/json'
    if($result.success) {
        Write-Host "LOGIN DESENVOLVEDOR: SUCESSO!" -ForegroundColor Green
        Write-Host "Usuario: $($result.user.name)" -ForegroundColor Green
        Write-Host "Email: $($result.user.email)" -ForegroundColor Green
        Write-Host "Roles: $($result.user.roles -join ', ')" -ForegroundColor Green
    } else {
        Write-Host "LOGIN DESENVOLVEDOR: FALHOU!" -ForegroundColor Red
    }
} catch {
    Write-Host "LOGIN DESENVOLVEDOR: ERRO!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Teste concluido!" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Se todos os testes passaram, o sistema esta funcionando!" -ForegroundColor Green
Write-Host "Agora voce pode acessar: http://localhost:8080" -ForegroundColor Yellow
Write-Host ""
Write-Host "Credenciais:" -ForegroundColor White
Write-Host "  Admin: admin@adjpa.com / Admin@123" -ForegroundColor White
Write-Host "  Dev:   desenvolvedor@adjpa.com / dev@ecclesia_secure_2024" -ForegroundColor White
Write-Host ""