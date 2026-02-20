# Script de Teste - Formulário de Membros
# Testa a integração completa do formulário de membros com o backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TESTE - FORMULÁRIO DE MEMBROS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:3001/api"
$TOKEN = ""

# Função para fazer login
function Login {
    Write-Host "1. Fazendo login..." -ForegroundColor Yellow
    
    $body = @{
        email = "admin@adjpa.com"
        password = "Admin@123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/auth/login" -Method POST -Body $body -ContentType "application/json"
        $script:TOKEN = $response.token
        Write-Host "   ✅ Login realizado com sucesso!" -ForegroundColor Green
        Write-Host "   Token: $($TOKEN.Substring(0, 20))..." -ForegroundColor Gray
        return $true
    } catch {
        Write-Host "   ❌ Erro no login: $_" -ForegroundColor Red
        return $false
    }
}

# Função para listar ministérios
function ListMinistries {
    Write-Host ""
    Write-Host "2. Listando ministérios..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/ministries" -Method GET -Headers $headers
        Write-Host "   ✅ Ministérios encontrados: $($response.data.Count)" -ForegroundColor Green
        
        foreach ($ministry in $response.data) {
            Write-Host "      - $($ministry.name)" -ForegroundColor Gray
        }
        return $response.data
    } catch {
        Write-Host "   ❌ Erro ao listar ministérios: $_" -ForegroundColor Red
        return @()
    }
}

# Função para listar células
function ListCells {
    Write-Host ""
    Write-Host "3. Listando células..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/cells" -Method GET -Headers $headers
        Write-Host "   ✅ Células encontradas: $($response.data.Count)" -ForegroundColor Green
        
        foreach ($cell in $response.data) {
            Write-Host "      - $($cell.name)" -ForegroundColor Gray
        }
        return $response.data
    } catch {
        Write-Host "   ❌ Erro ao listar células: $_" -ForegroundColor Red
        return @()
    }
}

# Função para criar membro de teste
function CreateTestMember {
    param($ministries)
    
    Write-Host ""
    Write-Host "4. Criando membro de teste..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    $mainMinistry = if ($ministries.Count -gt 0) { $ministries[0].name } else { "Louvor e Adoração" }
    
    $body = @{
        # Unit ID (obrigatório)
        unit_id = "45b0a9ff-b5e8-4372-afcb-034a0001f774"
        
        # Dados Pessoais
        name = "João da Silva Teste"
        birth_date = "1990-05-15"
        cpf = "123.456.789-00"
        rg = "12.345.678-9"
        gender = "M"
        marital_status = "MARRIED"
        profession = "Engenheiro"
        email = "joao.teste@example.com"
        phone = "(11) 98765-4321"
        whatsapp = "(11) 98765-4321"
        
        # Vida Espiritual
        conversion_date = "2015-03-20"
        conversion_place = "Campanha de Evangelismo"
        baptism_date = "2015-06-15"
        baptism_church = "Igreja ADJPA"
        baptism_pastor = "Pastor José"
        holy_spirit_baptism = "SIM"
        membership_date = "2015-07-01"
        origin_church = ""
        discipleship_course = "CONCLUIDO"
        bible_school = $true
        status = "ACTIVE"
        
        # Ministérios
        main_ministry = $mainMinistry
        ministry_function = "membro"
        other_ministries = @("Louvor e Adoração", "Intercessão")
        ecclesiastical_position = "obreiro"
        consecration_date = "2020-01-15"
        spiritual_gifts = "Canto, Louvor, Ensino"
        talents = "Música, Canto, Liderança"
        cell_group = "Célula Centro"
        
        # Contribuições
        is_tither = $true
        is_regular_offerer = $true
        participates_campaigns = $true
        
        # Endereço
        address_zip_code = "01310-100"
        address_street = "Avenida Paulista"
        address_number = "1000"
        address_complement = "Apto 101"
        address_neighborhood = "Bela Vista"
        address_city = "São Paulo"
        address_state = "SP"
        
        # Observações
        observations = "Membro ativo e participativo"
        special_needs = "Nenhuma"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/members" -Method POST -Body $body -Headers $headers
        Write-Host "   ✅ Membro criado com sucesso!" -ForegroundColor Green
        Write-Host "   ID: $($response.data.id)" -ForegroundColor Gray
        Write-Host "   Nome: $($response.data.name)" -ForegroundColor Gray
        return $response.data
    } catch {
        Write-Host "   ❌ Erro ao criar membro: $_" -ForegroundColor Red
        Write-Host "   Detalhes: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        return $null
    }
}

# Função para buscar membro criado
function GetMember {
    param($memberId)
    
    Write-Host ""
    Write-Host "5. Buscando membro criado..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/members/$memberId" -Method GET -Headers $headers
        Write-Host "   ✅ Membro encontrado!" -ForegroundColor Green
        Write-Host "   Nome: $($response.data.name)" -ForegroundColor Gray
        Write-Host "   Status: $($response.data.status)" -ForegroundColor Gray
        Write-Host "   Ministério: $($response.data.main_ministry)" -ForegroundColor Gray
        Write-Host "   Dizimista: $($response.data.is_tither)" -ForegroundColor Gray
        return $response.data
    } catch {
        Write-Host "   ❌ Erro ao buscar membro: $_" -ForegroundColor Red
        return $null
    }
}

# Função para atualizar membro
function UpdateMember {
    param($memberId)
    
    Write-Host ""
    Write-Host "6. Atualizando membro..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        profession = "Engenheiro de Software"
        ecclesiastical_position = "presbitero"
        observations = "Membro atualizado via teste"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/members/$memberId" -Method PUT -Body $body -Headers $headers
        Write-Host "   ✅ Membro atualizado com sucesso!" -ForegroundColor Green
        Write-Host "   Profissão: $($response.data.profession)" -ForegroundColor Gray
        Write-Host "   Cargo: $($response.data.ecclesiastical_position)" -ForegroundColor Gray
        return $response.data
    } catch {
        Write-Host "   ❌ Erro ao atualizar membro: $_" -ForegroundColor Red
        return $null
    }
}

# Função para deletar membro de teste
function DeleteMember {
    param($memberId)
    
    Write-Host ""
    Write-Host "7. Deletando membro de teste..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $TOKEN"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/members/$memberId" -Method DELETE -Headers $headers
        Write-Host "   ✅ Membro deletado com sucesso!" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "   ❌ Erro ao deletar membro: $_" -ForegroundColor Red
        return $false
    }
}

# Executar testes
Write-Host "Iniciando testes..." -ForegroundColor Cyan
Write-Host ""

if (Login) {
    $ministries = ListMinistries
    $cells = ListCells
    
    $member = CreateTestMember -ministries $ministries
    
    if ($member) {
        $memberId = $member.id
        
        $memberData = GetMember -memberId $memberId
        
        if ($memberData) {
            UpdateMember -memberId $memberId
            DeleteMember -memberId $memberId
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TESTES CONCLUÍDOS!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Acesse o formulário em:" -ForegroundColor Yellow
Write-Host "http://localhost:8081/igreja/membros/novo" -ForegroundColor Green
Write-Host ""
