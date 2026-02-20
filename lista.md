# Sistema de Gestão Ministerial ADJPA - Documentação Completa

## 📋 Índice
1. [Visão Geral do Sistema](#visão-geral)
2. [Módulos e Recursos](#módulos-e-recursos)
3. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
4. [Protocolo de Migração](#protocolo-de-migração)
5. [Configuração para Uso Local Multi-Computador](#configuração-local)

---

## 🎯 Visão Geral do Sistema

Sistema ERP completo para gestão de igrejas e ministérios, desenvolvido com:
- **Frontend**: React + TypeScript + Vite + Shadcn/UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Autenticação**: Supabase Auth com controle de papéis (RBAC)

### Papéis de Usuário (Roles)
- `admin` - Administrador total
- `secretary` - Secretária (gestão de membros)
- `treasurer` - Tesoureiro (financeiro)
- `pastor` - Pastor (acesso pastoral)
- `rh` - Recursos Humanos
- `dp` - Departamento Pessoal
- `financeiro` - Financeiro
- `developer` - Desenvolvedor
- `readonly` - Somente leitura

---

## 📦 Módulos e Recursos

### 1. MÓDULO DE AUTENTICAÇÃO E USUÁRIOS
**Recursos:**
- Login com email/senha ou username/senha
- Registro de novos usuários
- Recuperação de senha
- Perfis de usuário
- Controle de acesso baseado em papéis (RBAC)
- Multi-unidade (várias igrejas/congregações)

**Tabelas:**
- `profiles` - Perfis de usuário
- `user_roles` - Papéis e permissões
- `units` - Unidades/Congregações


### 2. MÓDULO DE MEMBROS (50+ campos)
**Recursos:**
- Cadastro completo de membros
- Gestão de vida cristã e ministerial
- Controle de contribuições
- Carteirinhas de membro com QR Code
- Histórico de atividades

**Campos da Tabela `members`:**
- **Identificação**: id, unit_id, name, cpf, rg, email, phone, whatsapp, profession
- **Status**: role (MEMBER/VISITOR/VOLUNTEER/STAFF/LEADER), status (ACTIVE/INACTIVE/PENDING)
- **Dados Pessoais**: birth_date, gender (M/F/OTHER), marital_status, blood_type
- **Vida Cristã**: conversion_date, conversion_place, baptism_date, baptism_church, baptizing_pastor, holy_spirit_baptism
- **Formação**: membership_date, church_of_origin, discipleship_course, biblical_school
- **Ministérios**: main_ministry, ministry_role, other_ministries[], ecclesiastical_position, consecration_date
- **Financeiro**: is_tithable, is_regular_giver, participates_campaigns
- **Adicionais**: spiritual_gifts, cell_group, talents, special_needs, observations, avatar_url
- **Endereço**: address_zip_code, address_street, address_number, address_complement, address_neighborhood, address_city, address_state
- **Emergência**: emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
- **Controle**: created_by, created_at, updated_at

### 3. MÓDULO DE FUNCIONÁRIOS/RH (80+ campos)
**Recursos:**
- Cadastro completo de funcionários
- Gestão de documentos trabalhistas
- Controle de benefícios
- Dados bancários
- Crachás com QR Code
- Vínculo com membros

**Campos da Tabela `employees`:**
- **Identificação**: id, unit_id, member_id, matricula, name, cpf, rg, pis, ctps, titulo_eleitor, reservista, photo_url
- **Dados Pessoais**: birth_date, gender, marital_status, blood_type, nationality, education_level, race_color
- **PCD**: is_pcd, disability_type
- **CNH**: cnh_number, cnh_category, cnh_expiry
- **Emergência**: emergency_contact, emergency_phone
- **Profissionais**: position, function, department, cbo, admission_date, termination_date, contract_type, work_schedule, work_regime
- **ASO**: aso_date, aso_expiry
- **Remuneração**: base_salary, salary_type, union_name, collective_agreement
- **Horas Extras**: he50_rate, he100_rate, dsr_active, night_shift_hours
- **Adicionais de Risco**: insalubrity_grade, hazard_active
- **Outros Proventos**: commission_rate, gratification, bonus, ats_percentage, housing_allowance
- **Dependentes**: dependents_count
- **Dados Bancários**: bank_name, bank_code, bank_agency, bank_account, bank_account_type, bank_holder_name, pix_key
- **Benefícios**: vt_active, vt_value, va_active, va_value, vr_active, vr_value, health_plan_active, health_plan_employee, health_plan_dependents, dental_plan_active, pharmacy_allowance, life_insurance
- **Endereço**: address_zip_code, address_street, address_number, address_complement, address_neighborhood, address_city, address_state
- **Status**: status
- **Controle**: created_by, created_at, updated_at


### 4. MÓDULO DE DEPENDENTES
**Recursos:**
- Cadastro de dependentes de funcionários
- Controle para IRRF e salário família

**Campos da Tabela `dependents`:**
- id, employee_id, name, birth_date, relationship (FILHO/CONJUGE/PAI/MAE/OUTRO)
- cpf, is_irrf_dependent, is_family_salary, created_at

### 5. MÓDULO DE FOLHA DE PAGAMENTO (50+ campos)
**Recursos:**
- Cálculo automático de folha
- Proventos e descontos
- Impostos (INSS, IRRF, FGTS)
- Encargos patronais
- Histórico mensal

**Campos da Tabela `payrolls`:**
- **Identificação**: id, unit_id, employee_id, month, year
- **Proventos**: base_salary, he50_hours, he50_value, he100_hours, he100_value, dsr_value, night_shift_value, insalubrity_value, hazard_value, commission_value, gratification, bonus, ats_value, housing_allowance, rounding, other_earnings
- **Descontos**: absences_days, absences_value, late_hours, late_value, advance, alimony, payroll_loan, other_deductions, coparticipation
- **Benefícios Descontados**: vt_discount, va_discount, health_plan_discount
- **Impostos**: inss_base, inss_rate, inss_value, irrf_base, irrf_rate, irrf_deduction, irrf_value, fgts_base, fgts_value
- **Patronais**: inss_employer, fgts_employer, rat, third_parties
- **Totais**: total_earnings, total_deductions, net_salary
- **Status**: status, paid_at
- **Controle**: created_by, created_at, updated_at

### 6. MÓDULO DE AFASTAMENTOS
**Recursos:**
- Gestão de férias, licenças médicas, maternidade, etc.
- Anexo de atestados
- Controle de CID10

**Campos da Tabela `employee_leaves`:**
- id, unit_id, employee_id
- type (VACATION/MEDICAL/MATERNITY/PATERNITY/MILITARY/WEDDING/BEREAVEMENT/UNPAID)
- start_date, end_date, cid10, doctor_name, crm
- status (SCHEDULED/ACTIVE/COMPLETED/CANCELLED)
- observations, attachment_url
- created_by, created_at, updated_at

### 7. MÓDULO DE PATRIMÔNIO
**Recursos:**
- Cadastro de bens da igreja
- Controle de depreciação
- Localização e responsável
- Fotos dos bens

**Campos da Tabela `assets`:**
- id, unit_id, description
- category (IMOVEL/VEICULO/SOM_LUZ/INSTRUMENTO/MOVEL/INFORMATICA/OUTROS)
- asset_number, acquisition_date, acquisition_value, current_value, depreciation_rate
- location, condition (NOVO/BOM/REGULAR/PRECARIO), responsible
- observations, photo_url
- created_by, created_at, updated_at


### 8. MÓDULO FINANCEIRO
**Recursos:**
- Contas a pagar e receber
- Fluxo de caixa
- Conciliação bancária
- Múltiplas contas
- Parcelamento
- Categorização

#### 8.1 Contas Financeiras (`financial_accounts`)
- id, unit_id, name, type (CASH/BANK)
- bank_name, bank_agency, bank_account
- current_balance, is_active
- created_at, updated_at

#### 8.2 Transações (`transactions`)
- **Identificação**: id, unit_id, account_id, member_id
- **Dados**: description, amount, date, competency_date
- **Tipo**: type (INCOME/EXPENSE), category, operation_nature, cost_center, project_id
- **Referência**: reference, invoice_number
- **Pagamento**: payment_method (CASH/PIX/CREDIT_CARD/DEBIT_CARD/TRANSFER/BOLETO/CHECK)
- **Fornecedor**: provider_name, provider_cpf, provider_cnpj
- **Parcelamento**: is_installment, installments_count, current_installment, parent_transaction_id
- **Status**: status, is_reconciled
- **Anexo**: attachment_url
- **Controle**: created_by, created_at, updated_at

### 9. MÓDULO DE CONTRIBUIÇÕES
**Recursos:**
- Registro de dízimos e ofertas
- Campanhas especiais
- Histórico por membro
- Relatórios de contribuição

**Campos da Tabela `member_contributions`:**
- id, unit_id, member_id, transaction_id
- type (TITHE/OFFERING/CAMPAIGN/SPECIAL)
- amount, date, observations
- created_at

### 10. MÓDULO DE EVENTOS
**Recursos:**
- Agenda de cultos e eventos
- Eventos recorrentes
- Controle de capacidade
- Recursos necessários

**Campos da Tabela `events`:**
- id, unit_id, title, description
- date, time, end_date, end_time, location
- type (SERVICE/MEETING/COURSE/RETREAT/CONFERENCE/OTHER)
- attendees_count, max_capacity
- is_recurring, recurrence_pattern
- responsible, resources_needed, observations
- created_by, created_at, updated_at

### 11. MÓDULO DE CONFIGURAÇÕES FISCAIS
**Recursos:**
- Tabelas de INSS, IRRF, FGTS
- Alíquotas patronais
- RAT (Risco Ambiental do Trabalho)
- Vigência de tabelas

**Campos da Tabela `tax_configurations`:**
- id, unit_id, name
- type (INSS/IRRF/FGTS/PATRONAL/RAT)
- brackets (JSONB com faixas), rate
- is_active, valid_from, valid_until
- created_at, updated_at


### 12. MÓDULO DE AUDITORIA
**Recursos:**
- Log de todas as operações
- Rastreamento de alterações
- IP e User Agent
- Dados antes/depois

**Campos da Tabela `audit_logs`:**
- id, unit_id, user_id, user_name
- action, entity, entity_id
- old_data (JSONB), new_data (JSONB)
- ip_address, user_agent
- created_at

### 13. MÓDULO DE UNIDADES
**Recursos:**
- Múltiplas congregações
- Sede e filiais
- Dados da igreja

**Campos da Tabela `units`:**
- id, name, cnpj, address, city, state
- phone, email, is_headquarter
- created_at, updated_at

---

## 🗄️ Estrutura do Banco de Dados

### Resumo das Tabelas

| Tabela | Campos | Descrição |
|--------|--------|-----------|
| `units` | 11 | Unidades/Congregações |
| `profiles` | 9 | Perfis de usuário |
| `user_roles` | 5 | Papéis e permissões |
| `members` | 50+ | Cadastro de membros |
| `employees` | 80+ | Cadastro de funcionários |
| `dependents` | 8 | Dependentes de funcionários |
| `payrolls` | 50+ | Folha de pagamento |
| `employee_leaves` | 14 | Afastamentos |
| `assets` | 16 | Patrimônio |
| `financial_accounts` | 10 | Contas financeiras |
| `transactions` | 25+ | Transações financeiras |
| `member_contributions` | 8 | Contribuições de membros |
| `events` | 19 | Eventos da igreja |
| `tax_configurations` | 10 | Configurações fiscais |
| `audit_logs` | 12 | Logs de auditoria |

### Relacionamentos Principais

```
units (1) ----< (N) members
units (1) ----< (N) employees
units (1) ----< (N) transactions
units (1) ----< (N) events
units (1) ----< (N) assets

members (1) ----< (N) employees (opcional)
members (1) ----< (N) member_contributions
members (1) ----< (N) transactions (opcional)

employees (1) ----< (N) dependents
employees (1) ----< (N) payrolls
employees (1) ----< (N) employee_leaves

financial_accounts (1) ----< (N) transactions

transactions (1) ----< (N) member_contributions (opcional)
transactions (1) ----< (N) transactions (parcelamento)

auth.users (1) ----< (N) user_roles
auth.users (1) ---- (1) profiles
```


---

## 🔄 Protocolo de Migração para Banco Local

### Opção 1: PostgreSQL Local (Recomendado)

#### Vantagens
- ✅ Sem limites de armazenamento
- ✅ Performance máxima
- ✅ Controle total dos dados
- ✅ Backup local
- ✅ Funciona offline
- ✅ Compatível 100% com Supabase

#### Requisitos
- PostgreSQL 14+ instalado
- Rede local configurada
- Servidor dedicado ou computador principal

#### Passo a Passo

**1. Instalar PostgreSQL**

Windows:
```bash
# Baixar instalador oficial
https://www.postgresql.org/download/windows/

# Ou via Chocolatey
choco install postgresql
```

Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

macOS:
```bash
brew install postgresql@14
brew services start postgresql@14
```

**2. Configurar PostgreSQL para Acesso em Rede**

Editar `postgresql.conf`:
```conf
listen_addresses = '*'  # Aceitar conexões de qualquer IP
port = 5432
max_connections = 100
```

Editar `pg_hba.conf`:
```conf
# Permitir conexões da rede local
host    all    all    192.168.0.0/16    md5
host    all    all    10.0.0.0/8        md5
```

Reiniciar PostgreSQL:
```bash
# Windows
net stop postgresql-x64-14
net start postgresql-x64-14

# Linux
sudo systemctl restart postgresql

# macOS
brew services restart postgresql@14
```

**3. Criar Banco de Dados**

```sql
-- Conectar como superusuário
psql -U postgres

-- Criar banco
CREATE DATABASE adjpa_erp;

-- Criar usuário
CREATE USER adjpa_user WITH PASSWORD 'senha_segura_aqui';

-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE adjpa_erp TO adjpa_user;

-- Conectar ao banco
\c adjpa_erp

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```


**4. Executar Migrations**

```bash
# Copiar arquivos de migration do projeto
cd supabase/migrations

# Executar cada migration em ordem
psql -U adjpa_user -d adjpa_erp -f 20260204140427_d3d7c1ca-7d0a-44c9-a4e7-d067e3530d0f.sql
psql -U adjpa_user -d adjpa_erp -f 20260204140758_5c395b96-f18c-4e79-8efb-6d557055e4bf.sql
psql -U adjpa_user -d adjpa_erp -f 20260205144511_0093d4cb-4068-4238-ae1e-0529c33b8765.sql
```

**5. Configurar Autenticação Local**

Como o Supabase Auth não estará disponível localmente, você tem 3 opções:

**Opção A: Usar Supabase Local (Recomendado)**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar Supabase local
supabase start

# Isso iniciará:
# - PostgreSQL local
# - GoTrue (Auth)
# - PostgREST (API)
# - Storage
```

**Opção B: Implementar Auth Simples**
```sql
-- Criar tabela de usuários local
CREATE TABLE local_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Função de login
CREATE OR REPLACE FUNCTION local_login(p_email TEXT, p_password TEXT)
RETURNS TABLE(user_id UUID, success BOOLEAN) AS $
BEGIN
  RETURN QUERY
  SELECT id, (password_hash = crypt(p_password, password_hash))
  FROM local_users
  WHERE email = p_email;
END;
$ LANGUAGE plpgsql;
```

**Opção C: Manter Supabase Auth na Nuvem**
- Manter apenas o Auth no Supabase
- Migrar apenas os dados para PostgreSQL local

**6. Atualizar Configuração do Frontend**

Criar arquivo `.env.local`:
```env
# PostgreSQL Local
VITE_DATABASE_URL=postgresql://adjpa_user:senha_segura_aqui@192.168.1.100:5432/adjpa_erp

# Se usar Supabase Local
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=sua_chave_local

# Se manter Auth na nuvem
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

Atualizar `src/integrations/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})
```


**7. Configurar Backup Automático**

Script de backup (Linux/macOS):
```bash
#!/bin/bash
# backup_adjpa.sh

BACKUP_DIR="/var/backups/adjpa"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/adjpa_erp_$DATE.sql"

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Fazer backup
pg_dump -U adjpa_user -d adjpa_erp -F c -f $BACKUP_FILE

# Manter apenas últimos 30 dias
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "Backup concluído: $BACKUP_FILE"
```

Agendar backup diário (crontab):
```bash
# Editar crontab
crontab -e

# Adicionar linha (backup às 2h da manhã)
0 2 * * * /path/to/backup_adjpa.sh
```

Windows (Task Scheduler):
```batch
@echo off
REM backup_adjpa.bat

set BACKUP_DIR=C:\Backups\ADJPA
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_FILE=%BACKUP_DIR%\adjpa_erp_%DATE%.sql

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

"C:\Program Files\PostgreSQL\14\bin\pg_dump.exe" -U adjpa_user -d adjpa_erp -F c -f "%BACKUP_FILE%"

echo Backup concluído: %BACKUP_FILE%
```

---

### Opção 2: MySQL Local

#### Adaptações Necessárias

PostgreSQL e MySQL têm diferenças significativas. Principais mudanças:

**1. Tipos de Dados**
```sql
-- PostgreSQL → MySQL
UUID → CHAR(36) ou BINARY(16)
TIMESTAMPTZ → TIMESTAMP
JSONB → JSON
TEXT → TEXT ou VARCHAR
BOOLEAN → TINYINT(1)
DECIMAL(12,2) → DECIMAL(12,2) -- igual
```

**2. Funções**
```sql
-- PostgreSQL
gen_random_uuid() → UUID()
now() → NOW()
ARRAY → JSON array

-- Exemplo de conversão
-- PostgreSQL:
other_ministries TEXT[]

-- MySQL:
other_ministries JSON
```

**3. Row Level Security (RLS)**
MySQL não tem RLS nativo. Alternativas:
- Implementar no backend (Node.js/PHP)
- Usar views com WHERE clauses
- Usar triggers

**4. Script de Conversão Básico**

```sql
-- MySQL equivalente (exemplo parcial)
CREATE TABLE members (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  unit_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14),
  email VARCHAR(255),
  phone VARCHAR(20),
  role ENUM('MEMBER', 'VISITOR', 'VOLUNTEER', 'STAFF', 'LEADER') DEFAULT 'MEMBER',
  status ENUM('ACTIVE', 'INACTIVE', 'PENDING') DEFAULT 'ACTIVE',
  birth_date DATE,
  gender ENUM('M', 'F', 'OTHER'),
  other_ministries JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (unit_id) REFERENCES units(id),
  INDEX idx_unit_id (unit_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```


---

## 🌐 Configuração para Uso Local Multi-Computador

### Arquitetura Recomendada

```
┌─────────────────────────────────────────────────┐
│           SERVIDOR PRINCIPAL                     │
│  ┌──────────────────────────────────────────┐  │
│  │  PostgreSQL (porta 5432)                  │  │
│  │  - Banco de dados ADJPA                   │  │
│  │  - Backups automáticos                    │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  Supabase Local (opcional)                │  │
│  │  - Auth (porta 54321)                     │  │
│  │  - Storage (porta 54321)                  │  │
│  │  - PostgREST API (porta 54321)            │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  Servidor Web (opcional)                  │  │
│  │  - Nginx/Apache (porta 80/443)            │  │
│  │  - Servir aplicação React                 │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │    REDE LOCAL         │
        │    192.168.1.0/24     │
        └───────────┬───────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼────┐    ┌────▼────┐    ┌────▼────┐
│ PC 1   │    │  PC 2   │    │  PC 3   │
│ Admin  │    │ Secret. │    │ Tesour. │
└────────┘    └─────────┘    └─────────┘
```

### Configuração Passo a Passo

#### 1. Preparar Servidor Principal

**Requisitos Mínimos:**
- CPU: 4 cores
- RAM: 8GB
- Disco: 100GB SSD
- SO: Windows Server, Linux (Ubuntu 22.04) ou Windows 10/11 Pro

**Configurar IP Estático:**

Windows:
```
Painel de Controle → Rede → Propriedades do Adaptador
→ IPv4 → Usar o seguinte endereço IP:
IP: 192.168.1.100
Máscara: 255.255.255.0
Gateway: 192.168.1.1
DNS: 8.8.8.8
```

Linux:
```bash
# Editar /etc/netplan/01-netcfg.yaml
network:
  version: 2
  ethernets:
    eth0:
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]

# Aplicar
sudo netplan apply
```

#### 2. Configurar Firewall

**Windows Firewall:**
```powershell
# Permitir PostgreSQL
New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -LocalPort 5432 -Protocol TCP -Action Allow

# Permitir Supabase Local (se usar)
New-NetFirewallRule -DisplayName "Supabase" -Direction Inbound -LocalPort 54321 -Protocol TCP -Action Allow

# Permitir HTTP/HTTPS (se hospedar web)
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

**Linux (UFW):**
```bash
sudo ufw allow 5432/tcp    # PostgreSQL
sudo ufw allow 54321/tcp   # Supabase Local
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```


#### 3. Configurar Clientes (PCs da Rede)

**Opção A: Aplicação Web Centralizada**

Hospedar a aplicação React no servidor:

```bash
# No servidor
cd /var/www/adjpa
npm run build

# Configurar Nginx
sudo nano /etc/nginx/sites-available/adjpa

# Conteúdo:
server {
    listen 80;
    server_name 192.168.1.100;
    root /var/www/adjpa/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:54321;
    }
}

# Ativar site
sudo ln -s /etc/nginx/sites-available/adjpa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Clientes acessam via navegador: `http://192.168.1.100`

**Opção B: Aplicação Desktop em Cada PC**

Instalar Node.js em cada PC e configurar `.env.local`:

```env
# .env.local em cada PC
VITE_SUPABASE_URL=http://192.168.1.100:54321
VITE_SUPABASE_ANON_KEY=sua_chave_local
VITE_DATABASE_URL=postgresql://adjpa_user:senha@192.168.1.100:5432/adjpa_erp
```

Executar em cada PC:
```bash
npm install
npm run dev
```

**Opção C: Aplicação Electron (Desktop Nativo)**

Converter para aplicação desktop:

```bash
# Instalar Electron
npm install --save-dev electron electron-builder

# Criar main.js
# package.json adicionar:
{
  "main": "main.js",
  "scripts": {
    "electron": "electron .",
    "electron:build": "electron-builder"
  },
  "build": {
    "appId": "com.adjpa.erp",
    "productName": "ADJPA ERP",
    "win": {
      "target": "nsis"
    }
  }
}
```

#### 4. Sincronização e Backup

**Backup Incremental:**

```bash
#!/bin/bash
# backup_incremental.sh

BACKUP_DIR="/var/backups/adjpa"
LAST_BACKUP="$BACKUP_DIR/last_backup.sql"
DATE=$(date +%Y%m%d_%H%M%S)
INCREMENTAL="$BACKUP_DIR/incremental_$DATE.sql"

# Backup completo se não existir
if [ ! -f "$LAST_BACKUP" ]; then
    pg_dump -U adjpa_user -d adjpa_erp -F c -f "$LAST_BACKUP"
else
    # Backup incremental (apenas mudanças)
    pg_dump -U adjpa_user -d adjpa_erp -F c -f "$INCREMENTAL"
fi
```

**Replicação para Backup Remoto:**

```bash
# Configurar replicação streaming PostgreSQL
# No servidor principal (postgresql.conf):
wal_level = replica
max_wal_senders = 3
wal_keep_size = 64

# No servidor de backup:
# Criar réplica
pg_basebackup -h 192.168.1.100 -D /var/lib/postgresql/14/replica -U replication -P -v -R
```


#### 5. Monitoramento e Manutenção

**Monitorar Conexões:**

```sql
-- Ver conexões ativas
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    query
FROM pg_stat_activity
WHERE datname = 'adjpa_erp';

-- Matar conexão travada
SELECT pg_terminate_backend(pid);
```

**Logs de Acesso:**

```sql
-- Habilitar log de queries (postgresql.conf)
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_statement = 'all'
log_duration = on
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

**Monitoramento de Performance:**

```bash
# Instalar pgAdmin (interface gráfica)
# Windows: baixar instalador
https://www.pgadmin.org/download/

# Linux:
sudo apt install pgadmin4

# Ou usar ferramentas CLI
sudo apt install postgresql-contrib
```

**Script de Manutenção:**

```sql
-- Executar semanalmente
-- manutencao.sql

-- Vacuum e analyze
VACUUM ANALYZE;

-- Reindexar
REINDEX DATABASE adjpa_erp;

-- Estatísticas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 📊 Estimativa de Armazenamento

### Cálculo por Tabela (estimativa)

| Tabela | Tamanho Médio/Registro | 1.000 registros | 10.000 registros |
|--------|------------------------|-----------------|------------------|
| members | ~2 KB | 2 MB | 20 MB |
| employees | ~3 KB | 3 MB | 30 MB |
| payrolls | ~1 KB | 1 MB | 10 MB |
| transactions | ~1 KB | 1 MB | 10 MB |
| events | ~0.5 KB | 500 KB | 5 MB |
| assets | ~1 KB | 1 MB | 10 MB |
| audit_logs | ~2 KB | 2 MB | 20 MB |

### Projeção para Igreja Média (5 anos)

- 500 membros: ~1 MB
- 50 funcionários: ~150 KB
- 600 folhas de pagamento (50 func × 12 meses): ~600 KB
- 10.000 transações: ~10 MB
- 500 eventos: ~250 KB
- 100 ativos: ~100 KB
- 50.000 logs de auditoria: ~100 MB

**Total estimado: ~115 MB + índices (~30%) = ~150 MB**

Para 10 anos de operação: ~300 MB

### Recomendações de Hardware

**Servidor Pequeno (até 1.000 membros):**
- CPU: 4 cores
- RAM: 8 GB
- Disco: 100 GB SSD
- Rede: 100 Mbps

**Servidor Médio (1.000-5.000 membros):**
- CPU: 8 cores
- RAM: 16 GB
- Disco: 250 GB SSD
- Rede: 1 Gbps

**Servidor Grande (5.000+ membros):**
- CPU: 16 cores
- RAM: 32 GB
- Disco: 500 GB SSD NVMe
- Rede: 1 Gbps
- RAID 1 para redundância


---

## 🔐 Segurança e Boas Práticas

### 1. Segurança do Banco de Dados

**Senhas Fortes:**
```sql
-- Alterar senha do usuário
ALTER USER adjpa_user WITH PASSWORD 'S3nh@F0rt3!2024#ADJPA';

-- Política de senha forte (PostgreSQL 14+)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

**Criptografia de Dados Sensíveis:**
```sql
-- Criar função de criptografia
CREATE OR REPLACE FUNCTION encrypt_sensitive(data TEXT)
RETURNS TEXT AS $
BEGIN
  RETURN encode(pgp_sym_encrypt(data, 'chave_secreta_aqui'), 'base64');
END;
$ LANGUAGE plpgsql;

-- Descriptografar
CREATE OR REPLACE FUNCTION decrypt_sensitive(encrypted TEXT)
RETURNS TEXT AS $
BEGIN
  RETURN pgp_sym_decrypt(decode(encrypted, 'base64'), 'chave_secreta_aqui');
END;
$ LANGUAGE plpgsql;
```

**SSL/TLS:**
```conf
# postgresql.conf
ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'
```

### 2. Controle de Acesso

**Princípio do Menor Privilégio:**
```sql
-- Criar roles específicos
CREATE ROLE readonly_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_role;

CREATE ROLE secretary_role;
GRANT SELECT, INSERT, UPDATE ON members, events TO secretary_role;

CREATE ROLE financeiro_role;
GRANT SELECT, INSERT, UPDATE ON transactions, financial_accounts TO financeiro_role;

-- Atribuir role a usuário
GRANT readonly_role TO usuario_visitante;
```

### 3. Backup e Recuperação

**Estratégia 3-2-1:**
- 3 cópias dos dados
- 2 tipos de mídia diferentes
- 1 cópia offsite

**Script de Backup Completo:**
```bash
#!/bin/bash
# backup_completo.sh

BACKUP_DIR="/var/backups/adjpa"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/full_backup_$DATE.sql.gz"
REMOTE_SERVER="backup@192.168.1.200"
REMOTE_DIR="/backups/adjpa"

# Backup local comprimido
pg_dump -U adjpa_user -d adjpa_erp | gzip > $BACKUP_FILE

# Copiar para servidor remoto
scp $BACKUP_FILE $REMOTE_SERVER:$REMOTE_DIR/

# Copiar para nuvem (opcional)
# rclone copy $BACKUP_FILE gdrive:backups/adjpa/

# Manter apenas últimos 90 dias localmente
find $BACKUP_DIR -name "*.sql.gz" -mtime +90 -delete

# Verificar integridade
gunzip -t $BACKUP_FILE && echo "Backup OK" || echo "Backup CORROMPIDO!"
```

**Teste de Restauração:**
```bash
#!/bin/bash
# testar_restauracao.sh

TEST_DB="adjpa_erp_test"
BACKUP_FILE="/var/backups/adjpa/full_backup_20240216_020000.sql.gz"

# Criar banco de teste
createdb -U postgres $TEST_DB

# Restaurar
gunzip -c $BACKUP_FILE | psql -U postgres -d $TEST_DB

# Verificar
psql -U postgres -d $TEST_DB -c "SELECT COUNT(*) FROM members;"

# Limpar
dropdb -U postgres $TEST_DB
```


### 4. Auditoria e Compliance

**LGPD (Lei Geral de Proteção de Dados):**

```sql
-- Anonimizar dados para testes
CREATE OR REPLACE FUNCTION anonymize_member_data()
RETURNS void AS $
BEGIN
  UPDATE members SET
    cpf = 'XXX.XXX.XXX-XX',
    rg = 'XXXXXXXX',
    email = CONCAT('anonimo', id, '@example.com'),
    phone = '(XX) XXXXX-XXXX',
    whatsapp = '(XX) XXXXX-XXXX'
  WHERE status = 'INACTIVE' 
    AND updated_at < NOW() - INTERVAL '5 years';
END;
$ LANGUAGE plpgsql;

-- Direito ao esquecimento
CREATE OR REPLACE FUNCTION delete_member_data(member_uuid UUID)
RETURNS void AS $
BEGIN
  -- Registrar na auditoria
  INSERT INTO audit_logs (action, entity, entity_id, user_name)
  VALUES ('DELETE_GDPR', 'members', member_uuid::TEXT, 'SYSTEM');
  
  -- Deletar dados relacionados
  DELETE FROM member_contributions WHERE member_id = member_uuid;
  DELETE FROM members WHERE id = member_uuid;
END;
$ LANGUAGE plpgsql;
```

### 5. Performance e Otimização

**Índices Recomendados:**
```sql
-- Membros
CREATE INDEX idx_members_unit_status ON members(unit_id, status);
CREATE INDEX idx_members_cpf ON members(cpf) WHERE cpf IS NOT NULL;
CREATE INDEX idx_members_name ON members USING gin(to_tsvector('portuguese', name));

-- Funcionários
CREATE INDEX idx_employees_unit_status ON employees(unit_id, status);
CREATE INDEX idx_employees_matricula ON employees(matricula);
CREATE INDEX idx_employees_member ON employees(member_id) WHERE member_id IS NOT NULL;

-- Folha de pagamento
CREATE INDEX idx_payrolls_employee_period ON payrolls(employee_id, year, month);
CREATE INDEX idx_payrolls_unit_period ON payrolls(unit_id, year, month);

-- Transações
CREATE INDEX idx_transactions_unit_date ON transactions(unit_id, date DESC);
CREATE INDEX idx_transactions_type_status ON transactions(type, status);
CREATE INDEX idx_transactions_member ON transactions(member_id) WHERE member_id IS NOT NULL;

-- Eventos
CREATE INDEX idx_events_unit_date ON events(unit_id, date DESC);
CREATE INDEX idx_events_type ON events(type);

-- Auditoria
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_user_date ON audit_logs(user_id, created_at DESC);
```

**Particionamento (para grandes volumes):**
```sql
-- Particionar audit_logs por mês
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE audit_logs_2024_02 PARTITION OF audit_logs
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Automatizar criação de partições
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $
DECLARE
  start_date DATE;
  end_date DATE;
  partition_name TEXT;
BEGIN
  start_date := date_trunc('month', CURRENT_DATE + INTERVAL '1 month');
  end_date := start_date + INTERVAL '1 month';
  partition_name := 'audit_logs_' || to_char(start_date, 'YYYY_MM');
  
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF audit_logs FOR VALUES FROM (%L) TO (%L)',
    partition_name, start_date, end_date
  );
END;
$ LANGUAGE plpgsql;
```


---

## 🚀 Migração de Dados do Supabase para Local

### Passo a Passo Completo

**1. Exportar Dados do Supabase**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Listar projetos
supabase projects list

# Conectar ao projeto
supabase link --project-ref seu-projeto-ref

# Exportar schema
supabase db dump --schema public > schema.sql

# Exportar dados
supabase db dump --data-only > data.sql

# Ou exportar tudo
supabase db dump > full_backup.sql
```

**2. Preparar Ambiente Local**

```bash
# Criar banco local
createdb -U postgres adjpa_erp

# Conectar
psql -U postgres -d adjpa_erp

# Criar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

**3. Importar Schema**

```bash
# Importar schema
psql -U postgres -d adjpa_erp -f schema.sql

# Verificar tabelas
psql -U postgres -d adjpa_erp -c "\dt"
```

**4. Importar Dados**

```bash
# Importar dados
psql -U postgres -d adjpa_erp -f data.sql

# Verificar contagem
psql -U postgres -d adjpa_erp -c "
SELECT 
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
"
```

**5. Validar Migração**

```sql
-- Verificar integridade referencial
SELECT 
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE contype = 'f'
  AND connamespace = 'public'::regnamespace;

-- Verificar dados
SELECT 'members' as table_name, COUNT(*) as count FROM members
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'events', COUNT(*) FROM events;
```

**6. Atualizar Aplicação**

```typescript
// src/config/database.ts
export const DATABASE_CONFIG = {
  // Desenvolvimento local
  development: {
    host: 'localhost',
    port: 5432,
    database: 'adjpa_erp',
    user: 'adjpa_user',
    password: process.env.DB_PASSWORD
  },
  
  // Produção (servidor local)
  production: {
    host: '192.168.1.100',
    port: 5432,
    database: 'adjpa_erp',
    user: 'adjpa_user',
    password: process.env.DB_PASSWORD
  }
}
```

**7. Sincronização Bidirecional (Opcional)**

Se quiser manter Supabase como backup na nuvem:

```javascript
// sync-service.js
import { createClient } from '@supabase/supabase-js'
import pg from 'pg'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const pgClient = new pg.Client(LOCAL_DB_CONFIG)

async function syncToCloud() {
  // Buscar mudanças locais
  const changes = await pgClient.query(`
    SELECT * FROM audit_logs 
    WHERE created_at > $1 
    AND synced_to_cloud = false
  `, [lastSyncTime])
  
  // Enviar para Supabase
  for (const change of changes.rows) {
    await supabase.from(change.entity).upsert(change.new_data)
  }
  
  // Marcar como sincronizado
  await pgClient.query(`
    UPDATE audit_logs 
    SET synced_to_cloud = true 
    WHERE id = ANY($1)
  `, [changes.rows.map(r => r.id)])
}

// Executar a cada 5 minutos
setInterval(syncToCloud, 5 * 60 * 1000)
```


---

## 📱 Acesso Remoto e Mobile

### 1. VPN para Acesso Externo

**Configurar OpenVPN no Servidor:**

```bash
# Instalar OpenVPN
sudo apt install openvpn easy-rsa

# Configurar certificados
make-cadir ~/openvpn-ca
cd ~/openvpn-ca
./easyrsa init-pki
./easyrsa build-ca
./easyrsa gen-req server nopass
./easyrsa sign-req server server
./easyrsa gen-dh

# Configurar servidor
sudo nano /etc/openvpn/server.conf
```

**Configuração server.conf:**
```conf
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh.pem
server 10.8.0.0 255.255.255.0
push "route 192.168.1.0 255.255.255.0"
keepalive 10 120
cipher AES-256-CBC
user nobody
group nogroup
persist-key
persist-tun
status openvpn-status.log
verb 3
```

**Criar cliente:**
```bash
./easyrsa gen-req client1 nopass
./easyrsa sign-req client client1

# Gerar arquivo .ovpn para cliente
cat > client1.ovpn << EOF
client
dev tun
proto udp
remote SEU_IP_PUBLICO 1194
resolv-retry infinite
nobind
persist-key
persist-tun
ca ca.crt
cert client1.crt
key client1.key
cipher AES-256-CBC
verb 3
EOF
```

### 2. Aplicativo Mobile (React Native)

**Estrutura básica:**

```bash
# Criar projeto
npx react-native init ADJPAMobile

# Instalar dependências
npm install @supabase/supabase-js
npm install @react-navigation/native
npm install react-native-qrcode-scanner
```

**Configuração:**
```typescript
// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://192.168.1.100:54321' // ou VPN
const SUPABASE_ANON_KEY = 'sua_chave'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
```

### 3. Progressive Web App (PWA)

**Configurar PWA:**

```javascript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ADJPA ERP',
        short_name: 'ADJPA',
        description: 'Sistema de Gestão Ministerial',
        theme_color: '#1e40af',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300
              }
            }
          }
        ]
      }
    })
  ]
})
```

---

## 🔧 Troubleshooting

### Problemas Comuns

**1. Erro de Conexão Recusada**

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar porta
sudo netstat -tlnp | grep 5432

# Testar conexão
psql -h 192.168.1.100 -U adjpa_user -d adjpa_erp
```

**2. Erro de Autenticação**

```sql
-- Verificar método de autenticação
SELECT * FROM pg_hba_file_rules;

-- Resetar senha
ALTER USER adjpa_user WITH PASSWORD 'nova_senha';
```

**3. Performance Lenta**

```sql
-- Verificar queries lentas
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Analisar query específica
EXPLAIN ANALYZE SELECT * FROM members WHERE unit_id = 'xxx';
```

**4. Espaço em Disco**

```sql
-- Ver tamanho do banco
SELECT pg_size_pretty(pg_database_size('adjpa_erp'));

-- Ver tamanho por tabela
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Limpar espaço
VACUUM FULL;
```


---

## 📚 Recursos Adicionais

### Documentação Oficial

- **PostgreSQL**: https://www.postgresql.org/docs/
- **Supabase**: https://supabase.com/docs
- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/

### Ferramentas Recomendadas

**Gerenciamento de Banco:**
- pgAdmin 4 - Interface gráfica completa
- DBeaver - Cliente universal
- TablePlus - Interface moderna

**Monitoramento:**
- pgBadger - Análise de logs
- pg_stat_statements - Estatísticas de queries
- Grafana + Prometheus - Dashboards

**Backup:**
- pgBackRest - Backup e restore avançado
- Barman - Backup e recuperação
- WAL-G - Backup contínuo

### Scripts Úteis

**Verificação de Saúde do Banco:**

```sql
-- health_check.sql
-- Executar diariamente

-- 1. Conexões
SELECT 
  count(*) as total_connections,
  count(*) FILTER (WHERE state = 'active') as active,
  count(*) FILTER (WHERE state = 'idle') as idle
FROM pg_stat_activity
WHERE datname = 'adjpa_erp';

-- 2. Tamanho do banco
SELECT pg_size_pretty(pg_database_size('adjpa_erp')) as database_size;

-- 3. Tabelas maiores
SELECT 
  schemaname || '.' || tablename as table_name,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  n_live_tup as row_count
FROM pg_tables t
JOIN pg_stat_user_tables s ON t.tablename = s.relname
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;

-- 4. Índices não utilizados
SELECT 
  schemaname || '.' || tablename as table_name,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- 5. Bloat (inchaço de tabelas)
SELECT 
  schemaname || '.' || tablename as table_name,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  n_dead_tup as dead_tuples,
  ROUND(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_percentage
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;

-- 6. Locks
SELECT 
  pid,
  usename,
  pg_blocking_pids(pid) as blocked_by,
  query as blocked_query
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;
```

**Manutenção Automática:**

```sql
-- maintenance.sql
-- Executar semanalmente via cron

-- 1. Vacuum analyze
VACUUM ANALYZE;

-- 2. Reindex tabelas grandes
REINDEX TABLE members;
REINDEX TABLE employees;
REINDEX TABLE transactions;
REINDEX TABLE payrolls;

-- 3. Atualizar estatísticas
ANALYZE;

-- 4. Limpar logs antigos de auditoria (manter 1 ano)
DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '1 year';
```

---

## 📞 Suporte e Contato

### Checklist de Implementação

- [ ] Instalar PostgreSQL no servidor
- [ ] Configurar IP estático
- [ ] Configurar firewall
- [ ] Executar migrations
- [ ] Criar usuários e permissões
- [ ] Configurar backup automático
- [ ] Testar conexão de outros PCs
- [ ] Configurar aplicação frontend
- [ ] Importar dados do Supabase (se aplicável)
- [ ] Configurar monitoramento
- [ ] Documentar senhas e acessos
- [ ] Treinar usuários
- [ ] Testar restauração de backup

### Informações de Contato do Sistema

**Desenvolvedor:** [Seu Nome/Empresa]
**Email:** [seu-email@exemplo.com]
**Telefone:** [seu-telefone]
**Repositório:** [link-do-github]

---

## 📄 Licença e Termos de Uso

Este sistema foi desenvolvido para uso interno da ADJPA (Assembleia de Deus Jesus Pão que Alimenta).

**Direitos:**
- ✅ Uso interno ilimitado
- ✅ Modificação do código
- ✅ Backup e distribuição interna
- ❌ Revenda ou distribuição comercial
- ❌ Remoção de créditos

**Garantias:**
- Sistema fornecido "como está"
- Sem garantias de funcionamento
- Responsabilidade de backup é do usuário
- Suporte técnico mediante contrato

---

## 🎯 Próximos Passos

### Melhorias Futuras

1. **Integração com eSocial**
   - Envio automático de eventos
   - Validação de dados

2. **Nota Fiscal Eletrônica**
   - Emissão de NFS-e
   - Integração com prefeitura

3. **Business Intelligence**
   - Dashboards avançados
   - Relatórios gerenciais
   - Análise preditiva

4. **Aplicativo Mobile Nativo**
   - iOS e Android
   - Notificações push
   - Modo offline

5. **Integração com Bancos**
   - Conciliação automática
   - Pagamentos via API
   - Boletos automáticos

6. **Inteligência Artificial**
   - Chatbot para dúvidas
   - Previsão de contribuições
   - Detecção de anomalias

---

**Última atualização:** 16 de Fevereiro de 2026
**Versão do documento:** 1.0
**Versão do sistema:** 0.0.0

