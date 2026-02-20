# =====================================================
# ADJPA ERP - Teste Frontend + Backend
# =====================================================

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "ADJPA ERP - Teste Frontend + Backend" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Testar se o frontend está rodando
Write-Host "1. Testando Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-RestMethod -Uri 'http://localhost:8081' -Method GET -TimeoutSec 5
    if ($frontend -match "root") {
        Write-Host "   ✅ Frontend: ONLINE (http://localhost:8081)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Frontend: Resposta inesperada" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Frontend: OFFLINE" -ForegroundColor Red
    Write-Host "   Execute: npm run dev" -ForegroundColor Yellow
}

# Testar se a API está rodando
Write-Host ""
Write-Host "2. Testando API..." -ForegroundColor Yellow
try {
    $api = Invoke-RestMethod -Uri 'http://localhost:3001/api/health' -Method GET -TimeoutSec 5
    Write-Host "   ✅ API: ONLINE (http://localhost:3001)" -ForegroundColor Green
    Write-Host "   Status: $($api.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ API: OFFLINE" -ForegroundColor Red
    Write-Host "   Execute: cd api && npm run dev" -ForegroundColor Yellow
}

# Testar CORS
Write-Host ""
Write-Host "3. Testando CORS..." -ForegroundColor Yellow
try {
    $headers = @{
        'Origin' = 'http://localhost:8081'
        'Content-Type' = 'application/json'
    }
    $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/health' -Method GET -Headers $headers -UseBasicParsing
    if ($response.Headers['Access-Control-Allow-Origin']) {
        Write-Host "   ✅ CORS: Configurado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  CORS: Pode ter problemas" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ CORS: Erro na requisição" -ForegroundColor Red
}

# Testar login via API
Write-Host ""
Write-Host "4. Testando Login via API..." -ForegroundColor Yellow
try {
    $body = @{
        email = 'admin@adjpa.com'
        password = 'Admin@123'
    } | ConvertTo-Json
    
    $headers = @{
        'Content-Type' = 'application/json'
        'Origin' = 'http://localhost:8081'
    }
    
    $result = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $body -Headers $headers
    
    if ($result.success -and $result.token) {
        Write-Host "   ✅ Login API: FUNCIONANDO" -ForegroundColor Green
        Write-Host "   Token gerado: $($result.token.Substring(0,20))..." -ForegroundColor Green
        Write-Host "   Usuário: $($result.user.name)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Login API: Resposta inválida" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Login API: ERRO" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Diagnóstico Completo" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Se todos os testes passaram:" -ForegroundColor Green
Write-Host "1. Abra http://localhost:8081 no navegador" -ForegroundColor White
Write-Host "2. Use: admin@adjpa.com / Admin@123" -ForegroundColor White
Write-Host "3. Verifique o console do navegador (F12) para erros" -ForegroundColor White
Write-Host ""
Write-Host "Se o login não funcionar no navegador:" -ForegroundColor Yellow
Write-Host "1. Abra F12 (DevTools)" -ForegroundColor White
Write-Host "2. Vá na aba Console" -ForegroundColor White
Write-Host "3. Tente fazer login e veja os erros" -ForegroundColor White
Write-Host "4. Vá na aba Network e veja as requisições" -ForegroundColor White
Write-Host ""