# =====================================================
# ADJPA ERP - Teste URL da Foto
# =====================================================

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "ADJPA ERP - Teste URL da Foto" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Testar URLs diferentes
$filename = "photo-1771362670414-544671003.jpg"

Write-Host "Testando diferentes URLs para a foto:" -ForegroundColor Yellow
Write-Host ""

# URL 1: Direta
$url1 = "http://localhost:3001/uploads/$filename"
Write-Host "1. URL Direta: $url1" -ForegroundColor White
try {
    $response1 = Invoke-WebRequest -Uri $url1 -Method HEAD -UseBasicParsing
    Write-Host "   ✅ Status: $($response1.StatusCode) - FUNCIONANDO" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# URL 2: Via API
$url2 = "http://localhost:3001/api/upload/photo/$filename"
Write-Host ""
Write-Host "2. URL via API: $url2" -ForegroundColor White
try {
    # Primeiro fazer login
    $loginBody = @{
        email = 'admin@adjpa.com'
        password = 'Admin@123'
    } | ConvertTo-Json
    
    $loginResult = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $loginBody -ContentType 'application/json'
    $token = $loginResult.token
    
    $headers = @{ 'Authorization' = "Bearer $token" }
    $response2 = Invoke-WebRequest -Uri $url2 -Method GET -Headers $headers -UseBasicParsing
    Write-Host "   ✅ Status: $($response2.StatusCode) - FUNCIONANDO" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Conclusão" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "A URL correta para usar no frontend é:" -ForegroundColor Green
Write-Host "$url1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Verifique se o componente PhotoUpload está usando esta URL." -ForegroundColor White
Write-Host ""