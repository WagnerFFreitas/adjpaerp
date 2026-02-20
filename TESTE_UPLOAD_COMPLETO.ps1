# =====================================================
# ADJPA ERP - Teste Upload Completo
# =====================================================

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "ADJPA ERP - Teste Upload Completo" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Fazer login
Write-Host "1. Fazendo login..." -ForegroundColor Yellow
$loginBody = @{
    email = 'admin@adjpa.com'
    password = 'Admin@123'
} | ConvertTo-Json

$loginResult = Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $loginBody -ContentType 'application/json'
$token = $loginResult.token
Write-Host "   ✅ Login realizado" -ForegroundColor Green

# Criar um arquivo de teste simples (1x1 pixel PNG)
Write-Host ""
Write-Host "2. Criando arquivo de teste..." -ForegroundColor Yellow
$pngBytes = [System.Convert]::FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==")
$testFile = "test-image.png"
[System.IO.File]::WriteAllBytes($testFile, $pngBytes)
Write-Host "   ✅ Arquivo criado: $testFile" -ForegroundColor Green

# Fazer upload usando PowerShell
Write-Host ""
Write-Host "3. Fazendo upload..." -ForegroundColor Yellow
try {
    $headers = @{
        'Authorization' = "Bearer $token"
    }
    
    $form = @{
        'photo' = Get-Item $testFile
        'type' = 'employee'
        'id' = 'test-123'
    }
    
    $uploadResult = Invoke-RestMethod -Uri 'http://localhost:3001/api/upload/photo' -Method POST -Headers $headers -Form $form
    
    Write-Host "   ✅ Upload realizado com sucesso!" -ForegroundColor Green
    Write-Host "   Filename: $($uploadResult.data.filename)" -ForegroundColor Gray
    Write-Host "   URL retornada: $($uploadResult.data.url)" -ForegroundColor Gray
    
    # Testar se a imagem pode ser acessada
    $imageUrl = "http://localhost:3001/uploads/$($uploadResult.data.filename)"
    Write-Host ""
    Write-Host "4. Testando acesso à imagem..." -ForegroundColor Yellow
    Write-Host "   URL: $imageUrl" -ForegroundColor Gray
    
    $imageResponse = Invoke-WebRequest -Uri $imageUrl -Method HEAD -UseBasicParsing
    Write-Host "   ✅ Imagem acessível (Status: $($imageResponse.StatusCode))" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Erro no upload: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Limpar arquivo de teste
    if (Test-Path $testFile) {
        Remove-Item $testFile
    }
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Instruções para testar no navegador:" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Abra http://localhost:8081" -ForegroundColor White
Write-Host "2. Faça login com admin@adjpa.com / Admin@123" -ForegroundColor White
Write-Host "3. Vá em Funcionários > Novo Funcionário" -ForegroundColor White
Write-Host "4. Clique na área 'Upload Foto'" -ForegroundColor White
Write-Host "5. Selecione uma imagem pequena (JPG/PNG)" -ForegroundColor White
Write-Host "6. Abra o console do navegador (F12) para ver logs" -ForegroundColor White
Write-Host "7. Verifique se a URL da imagem está correta" -ForegroundColor White
Write-Host ""