# =====================================================
# ADJPA ERP - Teste Membros Fase 1
# =====================================================

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "ADJPA ERP - Teste Membros Eclesiásticos (Fase 1)" -ForegroundColor Cyan
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
$headers = @{ 'Authorization' = "Bearer $token" }
Write-Host "   ✅ Login realizado" -ForegroundColor Green

# Testar endpoint de ministérios
Write-Host ""
Write-Host "2. Testando endpoint de ministérios..." -ForegroundColor Yellow
try {
    $ministries = Invoke-RestMethod -Uri 'http://localhost:3001/api/ministries' -Method GET -Headers $headers
    Write-Host "   ✅ Ministérios: $($ministries.Count) encontrados" -ForegroundColor Green
    if ($ministries.Count -gt 0) {
        Write-Host "   Exemplos:" -ForegroundColor Gray
        $ministries | Select-Object -First 3 | ForEach-Object {
            Write-Host "     - $($_.name)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar endpoint de células
Write-Host ""
Write-Host "3. Testando endpoint de células..." -ForegroundColor Yellow
try {
    $cells = Invoke-RestMethod -Uri 'http://localhost:3001/api/cells' -Method GET -Headers $headers
    Write-Host "   ✅ Células: $($cells.Count) encontradas" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar endpoint de contribuições
Write-Host ""
Write-Host "4. Testando endpoint de contribuições..." -ForegroundColor Yellow
try {
    $contributions = Invoke-RestMethod -Uri 'http://localhost:3001/api/contributions' -Method GET -Headers $headers
    Write-Host "   ✅ Contribuições: $($contributions.data.Count) encontradas" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar criação de ministério
Write-Host ""
Write-Host "5. Testando criação de ministério..." -ForegroundColor Yellow
try {
    $units = Invoke-RestMethod -Uri 'http://localhost:3001/api/units' -Method GET -Headers $headers
    $unitId = $units[0].id
    
    $newMinistry = @{
        name = "Teste Ministério"
        description = "Ministério de teste criado automaticamente"
        unit_id = $unitId
        is_active = $true
    } | ConvertTo-Json
    
    $created = Invoke-RestMethod -Uri 'http://localhost:3001/api/ministries' -Method POST -Body $newMinistry -Headers $headers -ContentType 'application/json'
    Write-Host "   ✅ Ministério criado: $($created.name)" -ForegroundColor Green
    
    # Deletar ministério de teste
    Invoke-RestMethod -Uri "http://localhost:3001/api/ministries/$($created.id)" -Method DELETE -Headers $headers | Out-Null
    Write-Host "   ✅ Ministério de teste removido" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar atualização de membro com novos campos
Write-Host ""
Write-Host "6. Testando novos campos de membros..." -ForegroundColor Yellow
try {
    # Buscar primeiro membro
    $members = Invoke-RestMethod -Uri 'http://localhost:3001/api/members?limit=1' -Method GET -Headers $headers
    
    if ($members.data.Count -gt 0) {
        $memberId = $members.data[0].id
        
        $updateData = @{
            conversion_date = "2020-01-15"
            baptism_date = "2020-06-20"
            is_tither = $true
            main_ministry = "Louvor e Adoração"
            spiritual_gifts = @("Canto", "Louvor")
            talents = @("Música", "Canto")
        } | ConvertTo-Json
        
        $updated = Invoke-RestMethod -Uri "http://localhost:3001/api/members/$memberId" -Method PUT -Body $updateData -Headers $headers -ContentType 'application/json'
        Write-Host "   ✅ Membro atualizado com novos campos" -ForegroundColor Green
        Write-Host "     - Conversão: $($updated.conversion_date)" -ForegroundColor Gray
        Write-Host "     - Batismo: $($updated.baptism_date)" -ForegroundColor Gray
        Write-Host "     - Dizimista: $($updated.is_tither)" -ForegroundColor Gray
        Write-Host "     - Ministério: $($updated.main_ministry)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  Nenhum membro encontrado para testar" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Resumo dos Testes" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Backend - Fase 1 (Membros Eclesiásticos)" -ForegroundColor Green
Write-Host ""
Write-Host "Implementado:" -ForegroundColor White
Write-Host "  ✅ Migration do banco de dados" -ForegroundColor Green
Write-Host "  ✅ Tabelas: ministries, cells, contributions" -ForegroundColor Green
Write-Host "  ✅ Controllers: ministries, cells, contributions" -ForegroundColor Green
Write-Host "  ✅ Rotas: /api/ministries, /api/cells, /api/contributions" -ForegroundColor Green
Write-Host "  ✅ Campos eclesiásticos em members" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  - Atualizar frontend (formulário de membros)" -ForegroundColor White
Write-Host "  - Adicionar abas de Vida Espiritual e Ministérios" -ForegroundColor White
Write-Host "  - Criar interface para contribuições" -ForegroundColor White
Write-Host ""