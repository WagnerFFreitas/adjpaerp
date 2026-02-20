-- =====================================================
-- ADJPA ERP - MIGRAÇÃO COMPLETA (ORDEM CORRIGIDA)
-- =====================================================

-- 1. TABELA DE UNIDADES (SEM RLS COMPLEXO PRIMEIRO)
-- =====================================================

CREATE TABLE public.units (
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

ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Política temporária simples
CREATE POLICY "units_select_temp" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "units_insert_temp" ON public.units FOR INSERT TO authenticated WITH CHECK (true);

-- 2. TABELA DE PERFIS
-- =====================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  default_unit_id UUID REFERENCES public.units(id),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. TABELA DE PAPÉIS DE USUÁRIO
-- =====================================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'secretary', 'treasurer', 'pastor', 'rh', 'dp', 'financeiro', 'developer', 'readonly')),
  unit_id UUID REFERENCES public.units(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role, unit_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios papéis"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_roles_insert_temp" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (true);

-- 4. FUNÇÃO DE VERIFICAÇÃO DE PAPEL (Security Definer)
-- =====================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. ADICIONAR POLÍTICAS DE ADMIN
-- =====================================================

CREATE POLICY "Admins podem ver todos os perfis"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem gerenciar papéis"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. TABELA DE AUDITORIA
-- =====================================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id),
  user_id UUID REFERENCES auth.users(id),
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

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas admins podem ver auditoria"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sistema pode inserir logs"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);

-- 7. TABELA DE MEMBROS EXPANDIDA (50+ campos)
-- =====================================================

CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) NOT NULL,
  
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Membros visíveis para autenticados"
  ON public.members FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Secretárias e admins podem modificar membros"
  ON public.members FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'secretary') OR
    public.has_role(auth.uid(), 'pastor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'secretary') OR
    public.has_role(auth.uid(), 'pastor')
  );

-- 8. TABELA DE FUNCIONÁRIOS (80+ campos)
-- =====================================================

CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) NOT NULL,
  member_id UUID REFERENCES public.members(id),
  
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Funcionários visíveis para RH e DP"
  ON public.employees FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  );

CREATE POLICY "RH e DP podem modificar funcionários"
  ON public.employees FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  );

-- 9. TABELA DE DEPENDENTES
-- =====================================================

CREATE TABLE public.dependents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE,
  relationship TEXT NOT NULL CHECK (relationship IN ('FILHO', 'CONJUGE', 'PAI', 'MAE', 'OUTRO')),
  cpf TEXT,
  is_irrf_dependent BOOLEAN DEFAULT false,
  is_family_salary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.dependents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dependentes visíveis para RH e DP"
  ON public.dependents FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  );

CREATE POLICY "RH e DP podem modificar dependentes"
  ON public.dependents FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  );

-- 10. TABELA DE FOLHA DE PAGAMENTO
-- =====================================================

CREATE TABLE public.payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) NOT NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  
  -- Período
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(employee_id, month, year)
);

ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Folhas visíveis para RH/DP/Financeiro"
  ON public.payrolls FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp') OR
    public.has_role(auth.uid(), 'financeiro')
  );

CREATE POLICY "RH e DP podem modificar folhas"
  ON public.payrolls FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  );

-- 11. TABELA DE AFASTAMENTOS
-- =====================================================

CREATE TABLE public.employee_leaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) NOT NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('VACATION', 'MEDICAL', 'MATERNITY', 'PATERNITY', 'MILITARY', 'WEDDING', 'BEREAVEMENT', 'UNPAID')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cid10 TEXT,
  doctor_name TEXT,
  crm TEXT,
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
  observations TEXT,
  attachment_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.employee_leaves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Afastamentos visíveis para RH e DP"
  ON public.employee_leaves FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  );

CREATE POLICY "RH e DP podem modificar afastamentos"
  ON public.employee_leaves FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'rh') OR
    public.has_role(auth.uid(), 'dp')
  );

-- 12. TABELA DE PATRIMÔNIO
-- =====================================================

CREATE TABLE public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) NOT NULL,
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patrimônio visível para autenticados"
  ON public.assets FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins podem modificar patrimônio"
  ON public.assets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 13. CONTAS FINANCEIRAS
-- =====================================================

CREATE TABLE public.financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) NOT NULL,
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

ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contas visíveis para financeiro"
  ON public.financial_accounts FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'financeiro') OR
    public.has_role(auth.uid(), 'treasurer')
  );

CREATE POLICY "Financeiro pode modificar contas"
  ON public.financial_accounts FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'financeiro')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'financeiro')
  );

-- 14. TRANSAÇÕES FINANCEIRAS
-- =====================================================

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) NOT NULL,
  account_id UUID REFERENCES public.financial_accounts(id),
  member_id UUID REFERENCES public.members(id),
  
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
  parent_transaction_id UUID REFERENCES public.transactions(id),
  
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PAID', 'PENDING', 'ACTIVE', 'INACTIVE', 'CANCELLED')),
  is_reconciled BOOLEAN DEFAULT false,
  
  attachment_url TEXT,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transações visíveis para financeiro"
  ON public.transactions FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'financeiro') OR
    public.has_role(auth.uid(), 'treasurer')
  );

CREATE POLICY "Financeiro pode modificar transações"
  ON public.transactions FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'financeiro') OR
    public.has_role(auth.uid(), 'treasurer')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'financeiro') OR
    public.has_role(auth.uid(), 'treasurer')
  );

-- 15. CONTRIBUIÇÕES DE MEMBROS
-- =====================================================

CREATE TABLE public.member_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) NOT NULL,
  member_id UUID REFERENCES public.members(id) NOT NULL,
  transaction_id UUID REFERENCES public.transactions(id),
  type TEXT NOT NULL CHECK (type IN ('TITHE', 'OFFERING', 'CAMPAIGN', 'SPECIAL')),
  amount DECIMAL(14,2) NOT NULL,
  date DATE NOT NULL,
  observations TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.member_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contribuições visíveis para financeiro e secretaria"
  ON public.member_contributions FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'financeiro') OR
    public.has_role(auth.uid(), 'treasurer') OR
    public.has_role(auth.uid(), 'secretary')
  );

CREATE POLICY "Financeiro pode modificar contribuições"
  ON public.member_contributions FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'financeiro') OR
    public.has_role(auth.uid(), 'treasurer')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'financeiro') OR
    public.has_role(auth.uid(), 'treasurer')
  );

-- 16. EVENTOS DA IGREJA
-- =====================================================

CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id) NOT NULL,
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Eventos visíveis para autenticados"
  ON public.events FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Secretárias e pastores podem modificar eventos"
  ON public.events FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'secretary') OR
    public.has_role(auth.uid(), 'pastor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'secretary') OR
    public.has_role(auth.uid(), 'pastor')
  );

-- 17. TABELA DE CONFIGURAÇÕES DE IMPOSTOS
-- =====================================================

CREATE TABLE public.tax_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES public.units(id),
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

ALTER TABLE public.tax_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Configurações de impostos visíveis"
  ON public.tax_configurations FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins podem modificar configurações"
  ON public.tax_configurations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 18. FUNÇÃO DE UPDATED_AT AUTOMÁTICO
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER set_updated_at_units BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_members BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_employees BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_payrolls BEFORE UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_employee_leaves BEFORE UPDATE ON public.employee_leaves FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_assets BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_financial_accounts BEFORE UPDATE ON public.financial_accounts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_transactions BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_events BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_tax_configurations BEFORE UPDATE ON public.tax_configurations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 19. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 20. INSERIR UNIDADE SEDE PADRÃO
-- =====================================================

INSERT INTO public.units (name, is_headquarter)
VALUES ('AD Jesus Pão que Alimenta - Sede', true);