# 🚀 Plano de Implementação - FASE 1

## 📋 Objetivo da Fase 1

Completar os módulos essenciais para tornar o sistema utilizável:
1. Membros com dados eclesiásticos completos
2. Funcionários com benefícios e documentos
3. Dashboard com estatísticas básicas

---

## 1️⃣ MEMBROS - Campos Eclesiásticos

### Backend (API):

#### 1.1 Atualizar Migration de Membros
```sql
ALTER TABLE members ADD COLUMN IF NOT EXISTS conversion_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS conversion_place VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS baptism_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS baptism_church VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS baptism_pastor VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS holy_spirit_baptism BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS membership_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS origin_church VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS discipleship_course BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS bible_school BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS main_ministry VARCHAR(100);
ALTER TABLE members ADD COLUMN IF NOT EXISTS ministry_function VARCHAR(100);
ALTER TABLE members ADD COLUMN IF NOT EXISTS other_ministries TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS ecclesiastical_position VARCHAR(100);
ALTER TABLE members ADD COLUMN IF NOT EXISTS consecration_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_tither BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_regular_offerer BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS participates_campaigns BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS special_needs TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS talents TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS spiritual_gifts TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS cell_group VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS profession VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS role_function VARCHAR(100);
```

#### 1.2 Criar Tabelas Auxiliares
```sql
-- Ministérios
CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES members(id),
  unit_id UUID REFERENCES units(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Células/Grupos
CREATE TABLE cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  leader_id UUID REFERENCES members(id),
  location VARCHAR(255),
  meeting_day VARCHAR(50),
  meeting_time TIME,
  unit_id UUID REFERENCES units(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contribuições
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id),
  type VARCHAR(50) NOT NULL, -- TITHE, OFFERING, CAMPAIGN
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  payment_method VARCHAR(50),
  reference VARCHAR(255),
  unit_id UUID REFERENCES units(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 1.3 Atualizar Controller de Membros
- Adicionar campos no GET/POST/PUT
- Criar endpoints para ministérios
- Criar endpoints para células
- Criar endpoints para contribuições

### Frontend (React):

#### 1.4 Atualizar Formulário de Membros
- Adicionar aba "Vida Espiritual"
- Adicionar aba "Ministérios"
- Adicionar aba "Contribuições"
- Campos de seleção para ministérios
- Campos de seleção para células
- Histórico de contribuições

---

## 2️⃣ FUNCIONÁRIOS - Benefícios e Documentos

### Backend (API):

#### 2.1 Atualizar Migration de Funcionários
```sql
ALTER TABLE employees ADD COLUMN IF NOT EXISTS pis VARCHAR(20);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS ctps_number VARCHAR(20);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS ctps_series VARCHAR(10);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS ctps_uf VARCHAR(2);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS voter_title VARCHAR(20);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS military_certificate VARCHAR(20);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS aso_date DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS blood_type VARCHAR(5);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(255);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS cbo VARCHAR(10);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS union_name VARCHAR(255);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS collective_agreement VARCHAR(255);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS overtime_50 BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS overtime_100 BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS dsr_active BOOLEAN DEFAULT TRUE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS night_shift BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS unhealthiness_level VARCHAR(20);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS hazard_pay BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS commissions DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS bonuses DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS awards DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS ats_percentage DECIMAL(5,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS housing_allowance DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS rounding BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS dependents_count INTEGER DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS is_pcd BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS disability_type VARCHAR(100);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS account_holder VARCHAR(255);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS transport_voucher_active BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS transport_voucher_value DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS meal_voucher_active BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS meal_voucher_value DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS food_voucher_active BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS food_voucher_value DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS health_insurance_active BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS health_insurance_value DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS health_insurance_dependents BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS health_insurance_dependents_value DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS pharmacy_voucher DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS life_insurance DECIMAL(10,2) DEFAULT 0;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS cnh_number VARCHAR(20);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS cnh_category VARCHAR(5);
ALTER TABLE employees ADD COLUMN IF NOT EXISTS cnh_expiration DATE;
```

#### 2.2 Criar Tabela de Dependentes
```sql
CREATE TABLE employee_dependents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  birth_date DATE NOT NULL,
  cpf VARCHAR(14),
  irrf_dependent BOOLEAN DEFAULT FALSE,
  family_allowance BOOLEAN DEFAULT FALSE,
  health_insurance BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2.3 Atualizar Controller de Funcionários
- Adicionar todos os novos campos
- Criar endpoints para dependentes
- Validações específicas

### Frontend (React):

#### 2.4 Atualizar Formulário de Funcionários
- Expandir aba "Benefícios"
- Adicionar aba "Dependentes"
- Adicionar aba "Documentos Completos"
- Campos para CNH com alerta de vencimento
- Lista de dependentes com CRUD

---

## 3️⃣ DASHBOARD - Estatísticas Básicas

### Backend (API):

#### 3.1 Criar Controller de Dashboard
```typescript
// api/src/controllers/dashboardController.ts
export const getDashboardStats = async (req, res) => {
  // Total de membros
  // Total de funcionários
  // Arrecadação do mês
  // Frequência média
  // Novos visitantes
  // Aniversariantes do mês
  // CNHs vencendo
};
```

#### 3.2 Criar Rotas de Dashboard
```typescript
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/birthdays', getBirthdays);
router.get('/dashboard/cnh-expiring', getCNHExpiring);
router.get('/dashboard/financial-flow', getFinancialFlow);
```

### Frontend (React):

#### 3.3 Criar Página de Dashboard
- Cards de estatísticas
- Gráfico de fluxo financeiro
- Lista de aniversariantes
- Alertas de CNH vencendo
- Metas ministeriais (placeholder)

---

## 📅 Cronograma Estimado

### Semana 1:
- ✅ Dia 1-2: Migrations de membros e tabelas auxiliares
- ✅ Dia 3-4: Controller e rotas de membros
- ✅ Dia 5: Testes de API

### Semana 2:
- ✅ Dia 1-2: Migrations de funcionários e dependentes
- ✅ Dia 3-4: Controller e rotas de funcionários
- ✅ Dia 5: Testes de API

### Semana 3:
- ✅ Dia 1-2: Controller e rotas de dashboard
- ✅ Dia 3-5: Frontend - Formulário de membros

### Semana 4:
- ✅ Dia 1-3: Frontend - Formulário de funcionários
- ✅ Dia 4-5: Frontend - Dashboard

### Semana 5:
- ✅ Testes integrados
- ✅ Ajustes e correções
- ✅ Documentação

---

## 🎯 Entregáveis da Fase 1

1. ✅ Membros com todos os campos eclesiásticos
2. ✅ Funcionários com benefícios e documentos completos
3. ✅ Dashboard funcional com estatísticas
4. ✅ Tabelas auxiliares (ministérios, células, contribuições, dependentes)
5. ✅ Formulários completos no frontend
6. ✅ Validações e tratamento de erros
7. ✅ Documentação atualizada

---

**Deseja que eu comece a implementar agora? Por qual parte você gostaria de começar?**

Opções:
1. Membros (dados eclesiásticos)
2. Funcionários (benefícios e documentos)
3. Dashboard (estatísticas)
4. Todas simultaneamente (migrations primeiro)