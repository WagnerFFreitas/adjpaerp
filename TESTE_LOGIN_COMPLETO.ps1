# =====================================================
# ADJPA ERP - Teste Login Completo
# =====================================================

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "ADJPA ERP - Teste Login Completo" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Simular login do frontend
Write-Host "Simulando login do frontend..." -ForegroundColor Yellow

try {
    # Simular requisição do frontend
    $body = @{
        email = 'admin@adjpa.com'
        password = 'Admin@123'
    } | ConvertTo-Json
    
    $headers = @{
        'Content-Type' = 'application/json'
        'Origin' = 'http://localhost:8081'
        'Referer' = 'http://localhost:8081/'
        'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    Write-Host "Enviando requisição de login..." -ForegroundColor Gray
    $result = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $body -Headers $headers
    
    if ($result.success -and $result.token -and $result.user) {
        Write-Host ""
        Write-Host "✅ LOGIN FUNCIONANDO PERFEITAMENTE!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Dados retornados:" -ForegroundColor White
        Write-Host "  Token: $($result.token.Substring(0,30))..." -ForegroundColor Gray
        Write-Host "  ID: $($result.user.id)" -ForegroundColor Gray
        Write-Host "  Nome: $($result.user.name)" -ForegroundColor Gray
        Write-Host "  Email: $($result.user.email)" -ForegroundColor Gray
        Write-Host "  Roles: $($result.user.roles -join ', ')" -ForegroundColor Gray
        
        # Testar endpoint /me com o token
        Write-Host ""
        Write-Host "Testando endpoint /me com token..." -ForegroundColor Yellow
        
        $authHeaders = @{
            'Authorization' = "Bearer $($result.token)"
            'Content-Type' = 'application/json'
            'Origin' = 'http://localhost:8081'
        }
        
        try {
            $meResult = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/me' -Method GET -Headers $authHeaders
            Write-Host "✅ Endpoint /me funcionando!" -ForegroundColor Green
            Write-Host "  Perfil carregado: $($meResult.name)" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Erro no endpoint /me: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ Login retornou dados inválidos" -ForegroundColor Red
        Write-Host "Response: $($result | ConvertTo-Json)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ ERRO NO LOGIN!" -ForegroundColor Red
    Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "Status Code: $statusCode" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Instruções para testar no navegador:" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abra o navegador em: http://localhost:8081" -ForegroundColor White
Write-Host "2. Pressione F12 para abrir DevTools" -ForegroundColor White
Write-Host "3. Vá na aba Console" -ForegroundColor White
Write-Host "4. Use as credenciais:" -ForegroundColor White
Write-Host "   Email: admin@adjpa.com" -ForegroundColor Yellow
Write-Host "   Senha: Admin@123" -ForegroundColor Yellow
Write-Host "5. Clique em 'Entrar'" -ForegroundColor White
Write-Host "6. Se der erro, veja as mensagens no Console" -ForegroundColor White
Write-Host ""
Write-Host "Se o login funcionar, você será redirecionado para /dashboard" -ForegroundColor Green
Write-Host ""