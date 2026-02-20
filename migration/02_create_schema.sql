-- =====================================================
-- ADJPA ERP - SCHEMA COMPLETO
-- Baseado nas migrations do Supabase
-- =====================================================

\c adjpa_erp

-- 1. TABELA DE UNIDADES
-- =====================================================

CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  email TEXT,
  is_headquarter BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_units_headquarter ON units(is_headquarter);

-- 2. TABELA DE USUÁRIOS (substituindo auth.users do Supabase)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email_confirmed BOOLEAN DEFAULT false,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. TABELA DE PERFIS
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT,
  avatar_url TEXT,
  default_unit_id UUID REFERENCES units(id),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- 4. TABELA DE PAPÉIS DE USUÁRIO
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'secretary', 'treasurer', 'pastor', 'rh', 'dp', 'financeiro', 'developer', 'readonly')),
  unit_id UUID REFERENCES units(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role, unit_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);


-- 5. TABELA DE AUDITORIA
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id),
  user_id UUID REFERENCES users(id),
  user_name TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_date ON audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 6. TABELA DE MEMBROS (50+ campos)
-- =====================================================

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  
  -- Identificação básica
  name TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  profession TEXT,
  
  -- Status e função
  role TEXT DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'VISITOR', 'VOLUNTEER', 'STAFF', 'LEADER')),
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
  
  -- Dados pessoais
  birth_date DATE,
  gender TEXT CHECK (gender IN ('M', 'F', 'OTHER')),
  marital_status TEXT CHECK (marital_status IN ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED')),
  blood_type TEXT,
  
  -- Vida cristã
  conversion_date DATE,
  conversion_place TEXT,
  baptism_date DATE,
  baptism_church TEXT,
  baptizing_pastor TEXT,
  holy_spirit_baptism TEXT CHECK (holy_spirit_baptism IN ('SIM', 'NAO')),
  
  -- Formação eclesiástica
  membership_date DATE,
  church_of_origin TEXT,
  discipleship_course TEXT CHECK (discipleship_course IN ('NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO')),
  biblical_school TEXT CHECK (biblical_school IN ('ATIVO', 'INATIVO', 'NAO_FREQUENTA')),
  
  -- Ministérios
  main_ministry TEXT,
  ministry_role TEXT,
  other_ministries TEXT[],
  ecclesiastical_position TEXT,
  consecration_date DATE,
  
  -- Controle financeiro
  is_tithable BOOLEAN DEFAULT false,
  is_regular_giver BOOLEAN DEFAULT false,
  participates_campaigns BOOLEAN DEFAULT false,
  
  -- Informações adicionais
  spiritual_gifts TEXT,
  cell_group TEXT,
  talents TEXT,
  special_needs TEXT,
  observations TEXT,
  avatar_url TEXT,
  
  -- Endereço
  address_zip_code TEXT,
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  
  -- Contato de emergência
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Controle
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_members_unit_id ON members(unit_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_cpf ON members(cpf) WHERE cpf IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_members_name ON members USING gin(to_tsvector('portuguese', name));


-- 7. TABELA DE FUNCIONÁRIOS (80+ campos)
-- =====================================================

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  member_id UUID REFERENCES members(id),
  
  -- Identificação
  matricula TEXT UNIQUE,
  name TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  pis TEXT,
  ctps TEXT,
  titulo_eleitor TEXT,
  reservista TEXT,
  photo_url TEXT,
  
  -- Dados pessoais
  birth_date DATE,
  gender TEXT CHECK (gender IN ('M', 'F', 'OTHER')),
  marital_status TEXT CHECK (marital_status IN ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED')),
  blood_type TEXT,
  nationality TEXT,
  education_level TEXT,
  race_color TEXT,
  
  -- PCD
  is_pcd BOOLEAN DEFAULT false,
  disability_type TEXT,
  
  -- CNH
  cnh_number TEXT,
  cnh_category TEXT,
  cnh_expiry DATE,
  
  -- Contato de emergência
  emergency_contact TEXT,
  emergency_phone TEXT,
  
  -- Dados profissionais
  position TEXT NOT NULL,
  function TEXT,
  department TEXT,
  cbo TEXT,
  admission_date DATE NOT NULL,
  termination_date DATE,
  contract_type TEXT DEFAULT 'CLT' CHECK (contract_type IN ('CLT', 'PJ', 'VOLUNTARIO', 'TEMPORARIO')),
  work_schedule TEXT,
  work_regime TEXT DEFAULT 'PRESENCIAL' CHECK (work_regime IN ('PRESENCIAL', 'HIBRIDO', 'REMOTO')),
  
  -- ASO
  aso_date DATE,
  aso_expiry DATE,
  
  -- Remuneração
  base_salary DECIMAL(12,2) DEFAULT 0,
  salary_type TEXT DEFAULT 'MENSAL' CHECK (salary_type IN ('MENSAL', 'HORISTA', 'COMISSIONADO')),
  union_name TEXT,
  collective_agreement TEXT,
  
  -- Horas extras
  he50_rate DECIMAL(5,2) DEFAULT 50,
  he100_rate DECIMAL(5,2) DEFAULT 100,
  dsr_active BOOLEAN DEFAULT true,
  night_shift_hours DECIMAL(5,2) DEFAULT 0,
  
  -- Adicionais de risco
  insalubrity_grade TEXT DEFAULT 'NONE' CHECK (insalubrity_grade IN ('NONE', 'LOW', 'MEDIUM', 'HIGH')),
  hazard_active BOOLEAN DEFAULT false,
  
  -- Outros proventos
  commission_rate DECIMAL(5,2) DEFAULT 0,
  gratification DECIMAL(12,2) DEFAULT 0,
  bonus DECIMAL(12,2) DEFAULT 0,
  ats_percentage DECIMAL(5,2) DEFAULT 0,
  housing_allowance DECIMAL(12,2) DEFAULT 0,
  
  -- Dependentes
  dependents_count INTEGER DEFAULT 0,
  
  -- Dados bancários
  bank_name TEXT,
  bank_code TEXT,
  bank_agency TEXT,
  bank_account TEXT,
  bank_account_type TEXT CHECK (bank_account_type IN ('CORRENTE', 'POUPANCA')),
  bank_holder_name TEXT,
  pix_key TEXT,
  
  -- Benefícios
  vt_active BOOLEAN DEFAULT false,
  vt_value DECIMAL(12,2) DEFAULT 0,
  va_active BOOLEAN DEFAULT false,
  va_value DECIMAL(12,2) DEFAULT 0,
  vr_active BOOLEAN DEFAULT false,
  vr_value DECIMAL(12,2) DEFAULT 0,
  health_plan_active BOOLEAN DEFAULT false,
  health_plan_employee DECIMAL(12,2) DEFAULT 0,
  health_plan_dependents DECIMAL(12,2) DEFAULT 0,
  dental_plan_active BOOLEAN DEFAULT false,
  pharmacy_allowance DECIMAL(12,2) DEFAULT 0,
  life_insurance DECIMAL(12,2) DEFAULT 0,
  
  -- Endereço
  address_zip_code TEXT,
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  
  -- Status
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('PAID', 'PENDING', 'ACTIVE', 'INACTIVE', 'CANCELLED')),
  
  -- Controle
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employees_unit_id ON employees(unit_id);
CREATE INDEX IF NOT EXISTS idx_employees_member_id ON employees(member_id) WHERE member_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_employees_matricula ON employees(matricula);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_cpf ON employees(cpf) WHERE cpf IS NOT NULL;


-- 8. TABELA DE DEPENDENTES
-- =====================================================

CREATE TABLE IF NOT EXISTS dependents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE,
  relationship TEXT NOT NULL CHECK (relationship IN ('FILHO', 'CONJUGE', 'PAI', 'MAE', 'OUTRO')),
  cpf TEXT,
  is_irrf_dependent BOOLEAN DEFAULT false,
  is_family_salary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dependents_employee_id ON dependents(employee_id);

-- 9. TABELA DE FOLHA DE PAGAMENTO (50+ campos)
-- =====================================================

CREATE TABLE IF NOT EXISTS payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  
  -- Período
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  
  -- Proventos
  base_salary DECIMAL(12,2) DEFAULT 0,
  he50_hours DECIMAL(5,2) DEFAULT 0,
  he50_value DECIMAL(12,2) DEFAULT 0,
  he100_hours DECIMAL(5,2) DEFAULT 0,
  he100_value DECIMAL(12,2) DEFAULT 0,
  dsr_value DECIMAL(12,2) DEFAULT 0,
  night_shift_value DECIMAL(12,2) DEFAULT 0,
  insalubrity_value DECIMAL(12,2) DEFAULT 0,
  hazard_value DECIMAL(12,2) DEFAULT 0,
  commission_value DECIMAL(12,2) DEFAULT 0,
  gratification DECIMAL(12,2) DEFAULT 0,
  bonus DECIMAL(12,2) DEFAULT 0,
  ats_value DECIMAL(12,2) DEFAULT 0,
  housing_allowance DECIMAL(12,2) DEFAULT 0,
  rounding DECIMAL(12,2) DEFAULT 0,
  other_earnings DECIMAL(12,2) DEFAULT 0,
  
  -- Descontos
  absences_days DECIMAL(5,2) DEFAULT 0,
  absences_value DECIMAL(12,2) DEFAULT 0,
  late_hours DECIMAL(5,2) DEFAULT 0,
  late_value DECIMAL(12,2) DEFAULT 0,
  advance DECIMAL(12,2) DEFAULT 0,
  alimony DECIMAL(12,2) DEFAULT 0,
  payroll_loan DECIMAL(12,2) DEFAULT 0,
  other_deductions DECIMAL(12,2) DEFAULT 0,
  coparticipation DECIMAL(12,2) DEFAULT 0,
  
  -- Benefícios descontados
  vt_discount DECIMAL(12,2) DEFAULT 0,
  va_discount DECIMAL(12,2) DEFAULT 0,
  health_plan_discount DECIMAL(12,2) DEFAULT 0,
  
  -- Impostos
  inss_base DECIMAL(12,2) DEFAULT 0,
  inss_rate DECIMAL(5,2) DEFAULT 0,
  inss_value DECIMAL(12,2) DEFAULT 0,
  irrf_base DECIMAL(12,2) DEFAULT 0,
  irrf_rate DECIMAL(5,2) DEFAULT 0,
  irrf_deduction DECIMAL(12,2) DEFAULT 0,
  irrf_value DECIMAL(12,2) DEFAULT 0,
  fgts_base DECIMAL(12,2) DEFAULT 0,
  fgts_value DECIMAL(12,2) DEFAULT 0,
  
  -- Patronais
  inss_employer DECIMAL(12,2) DEFAULT 0,
  fgts_employer DECIMAL(12,2) DEFAULT 0,
  rat DECIMAL(12,2) DEFAULT 0,
  third_parties DECIMAL(12,2) DEFAULT 0,
  
  -- Totais
  total_earnings DECIMAL(12,2) DEFAULT 0,
  total_deductions DECIMAL(12,2) DEFAULT 0,
  net_salary DECIMAL(12,2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PAID', 'PENDING', 'ACTIVE', 'INACTIVE', 'CANCELLED')),
  paid_at TIMESTAMPTZ,
  
  -- Controle
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(employee_id, month, year)
);

CREATE INDEX IF NOT EXISTS idx_payrolls_employee_period ON payrolls(employee_id, year, month);
CREATE INDEX IF NOT EXISTS idx_payrolls_unit_period ON payrolls(unit_id, year, month);
CREATE INDEX IF NOT EXISTS idx_payrolls_status ON payrolls(status);

-- 10. TABELA DE AFASTAMENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS employee_leaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('VACATION', 'MEDICAL', 'MATERNITY', 'PATERNITY', 'MILITARY', 'WEDDING', 'BEREAVEMENT', 'UNPAID')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cid10 TEXT,
  doctor_name TEXT,
  crm TEXT,
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
  observations TEXT,
  attachment_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_employee_leaves_employee_id ON employee_leaves(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_leaves_dates ON employee_leaves(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_employee_leaves_status ON employee_leaves(status);


-- 11. TABELA DE PATRIMÔNIO
-- =====================================================

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('IMOVEL', 'VEICULO', 'SOM_LUZ', 'INSTRUMENTO', 'MOVEL', 'INFORMATICA', 'OUTROS')),
  asset_number TEXT,
  acquisition_date DATE,
  acquisition_value DECIMAL(12,2) DEFAULT 0,
  current_value DECIMAL(12,2) DEFAULT 0,
  depreciation_rate DECIMAL(5,2) DEFAULT 0,
  location TEXT,
  condition TEXT DEFAULT 'BOM' CHECK (condition IN ('NOVO', 'BOM', 'REGULAR', 'PRECARIO')),
  responsible TEXT,
  observations TEXT,
  photo_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_unit_id ON assets(unit_id);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_condition ON assets(condition);

-- 12. CONTAS FINANCEIRAS
-- =====================================================

CREATE TABLE IF NOT EXISTS financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('CASH', 'BANK')),
  bank_name TEXT,
  bank_agency TEXT,
  bank_account TEXT,
  current_balance DECIMAL(14,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_financial_accounts_unit_id ON financial_accounts(unit_id);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_type ON financial_accounts(type);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_active ON financial_accounts(is_active);

-- 13. TRANSAÇÕES FINANCEIRAS
-- =====================================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  account_id UUID REFERENCES financial_accounts(id),
  member_id UUID REFERENCES members(id),
  
  description TEXT NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  date DATE NOT NULL,
  competency_date DATE,
  type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
  category TEXT,
  operation_nature TEXT,
  cost_center TEXT,
  project_id TEXT,
  
  reference TEXT,
  invoice_number TEXT,
  
  payment_method TEXT CHECK (payment_method IN ('CASH', 'PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'TRANSFER', 'BOLETO', 'CHECK')),
  
  provider_name TEXT,
  provider_cpf TEXT,
  provider_cnpj TEXT,
  
  is_installment BOOLEAN DEFAULT false,
  installments_count INTEGER,
  current_installment INTEGER,
  parent_transaction_id UUID REFERENCES transactions(id),
  
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PAID', 'PENDING', 'ACTIVE', 'INACTIVE', 'CANCELLED')),
  is_reconciled BOOLEAN DEFAULT false,
  
  attachment_url TEXT,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_unit_date ON transactions(unit_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_member_id ON transactions(member_id) WHERE member_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_type_status ON transactions(type, status);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);

-- 14. CONTRIBUIÇÕES DE MEMBROS
-- =====================================================

CREATE TABLE IF NOT EXISTS member_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  member_id UUID REFERENCES members(id) NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  type TEXT NOT NULL CHECK (type IN ('TITHE', 'OFFERING', 'CAMPAIGN', 'SPECIAL')),
  amount DECIMAL(14,2) NOT NULL,
  date DATE NOT NULL,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_contributions_member_id ON member_contributions(member_id);
CREATE INDEX IF NOT EXISTS idx_member_contributions_date ON member_contributions(date DESC);
CREATE INDEX IF NOT EXISTS idx_member_contributions_type ON member_contributions(type);


-- 15. EVENTOS DA IGREJA
-- =====================================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  end_date DATE,
  end_time TIME,
  location TEXT,
  type TEXT DEFAULT 'OTHER' CHECK (type IN ('SERVICE', 'MEETING', 'COURSE', 'RETREAT', 'CONFERENCE', 'OTHER')),
  attendees_count INTEGER DEFAULT 0,
  max_capacity INTEGER,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  responsible TEXT,
  resources_needed TEXT,
  observations TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_unit_date ON events(unit_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);

-- 16. CONFIGURAÇÕES DE IMPOSTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS tax_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INSS', 'IRRF', 'FGTS', 'PATRONAL', 'RAT')),
  brackets JSONB,
  rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tax_configurations_type ON tax_configurations(type);
CREATE INDEX IF NOT EXISTS idx_tax_configurations_active ON tax_configurations(is_active);

-- 17. SESSÕES DE USUÁRIO (para controle de login)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

\echo 'Schema criado com sucesso!'
\echo 'Total de tabelas: 17'
\echo ''
\echo 'Tabelas criadas:'
\echo '  1. units'
\echo '  2. users'
\echo '  3. profiles'
\echo '  4. user_roles'
\echo '  5. audit_logs'
\echo '  6. members'
\echo '  7. employees'
\echo '  8. dependents'
\echo '  9. payrolls'
\echo ' 10. employee_leaves'
\echo ' 11. assets'
\echo ' 12. financial_accounts'
\echo ' 13. transactions'
\echo ' 14. member_contributions'
\echo ' 15. events'
\echo ' 16. tax_configurations'
\echo ' 17. user_sessions'
