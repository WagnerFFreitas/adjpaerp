// Tipos do sistema baseados no banco de dados

export type AppRole = 'admin' | 'secretary' | 'treasurer' | 'pastor' | 'rh' | 'dp' | 'financeiro' | 'developer' | 'readonly';

export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';
export type MemberRole = 'MEMBER' | 'VISITOR' | 'VOLUNTEER' | 'STAFF' | 'LEADER';
export type Gender = 'M' | 'F' | 'OTHER';
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
export type HolySpiritBaptism = 'SIM' | 'NAO';
export type DiscipleshipStatus = 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
export type BiblicalSchoolStatus = 'ATIVO' | 'INATIVO' | 'NAO_FREQUENTA';
export type ContractType = 'CLT' | 'PJ' | 'VOLUNTARIO' | 'TEMPORARIO';
export type SalaryType = 'MENSAL' | 'HORISTA' | 'COMISSIONADO';
export type WorkRegime = 'PRESENCIAL' | 'HIBRIDO' | 'REMOTO';
export type InsalubrityGrade = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
export type BankAccountType = 'CORRENTE' | 'POUPANCA';
export type PaymentStatus = 'PAID' | 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED';
export type LeaveType = 'VACATION' | 'MEDICAL' | 'MATERNITY' | 'PATERNITY' | 'MILITARY' | 'WEDDING' | 'BEREAVEMENT' | 'UNPAID';
export type LeaveStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type RelationshipType = 'FILHO' | 'CONJUGE' | 'PAI' | 'MAE' | 'OUTRO';
export type AssetCategory = 'IMOVEL' | 'VEICULO' | 'SOM_LUZ' | 'INSTRUMENTO' | 'MOVEL' | 'INFORMATICA' | 'OUTROS';
export type AssetCondition = 'NOVO' | 'BOM' | 'REGULAR' | 'PRECARIO';
export type TransactionType = 'INCOME' | 'EXPENSE';
export type PaymentMethod = 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER' | 'BOLETO' | 'CHECK';
export type FinancialAccountType = 'CASH' | 'BANK';
export type EventType = 'SERVICE' | 'MEETING' | 'COURSE' | 'RETREAT' | 'CONFERENCE' | 'OTHER';
export type ContributionType = 'TITHE' | 'OFFERING' | 'CAMPAIGN' | 'SPECIAL';
export type TaxConfigType = 'INSS' | 'IRRF' | 'FGTS' | 'PATRONAL' | 'RAT';

// Interfaces principais

export interface Unit {
  id: string;
  name: string;
  cnpj?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  is_headquarter: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  username?: string;
  avatar_url?: string;
  default_unit_id?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  unit_id?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  unit_id?: string;
  user_id?: string;
  user_name?: string;
  action: string;
  entity: string;
  entity_id?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface Member {
  id: string;
  unit_id: string;
  name: string;
  cpf?: string;
  rg?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  profession?: string;
  role: MemberRole;
  status: MemberStatus;
  birth_date?: string;
  gender?: Gender;
  marital_status?: MaritalStatus;
  blood_type?: string;
  conversion_date?: string;
  conversion_place?: string;
  baptism_date?: string;
  baptism_church?: string;
  baptizing_pastor?: string;
  holy_spirit_baptism?: HolySpiritBaptism;
  membership_date?: string;
  church_of_origin?: string;
  discipleship_course?: DiscipleshipStatus;
  biblical_school?: BiblicalSchoolStatus;
  main_ministry?: string;
  ministry_role?: string;
  other_ministries?: string[];
  ecclesiastical_position?: string;
  consecration_date?: string;
  is_tithable: boolean;
  is_regular_giver: boolean;
  participates_campaigns: boolean;
  spiritual_gifts?: string;
  cell_group?: string;
  talents?: string;
  special_needs?: string;
  observations?: string;
  avatar_url?: string;
  address_zip_code?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  unit_id: string;
  member_id?: string;
  matricula?: string;
  name: string;
  cpf?: string;
  rg?: string;
  pis?: string;
  ctps?: string;
  titulo_eleitor?: string;
  reservista?: string;
  photo_url?: string;
  birth_date?: string;
  gender?: Gender;
  marital_status?: MaritalStatus;
  blood_type?: string;
  nationality?: string;
  education_level?: string;
  race_color?: string;
  is_pcd: boolean;
  disability_type?: string;
  cnh_number?: string;
  cnh_category?: string;
  cnh_expiry?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  position: string;
  function?: string;
  department?: string;
  cbo?: string;
  admission_date: string;
  termination_date?: string;
  contract_type: ContractType;
  work_schedule?: string;
  work_regime: WorkRegime;
  aso_date?: string;
  aso_expiry?: string;
  base_salary: number;
  salary_type: SalaryType;
  union_name?: string;
  collective_agreement?: string;
  he50_rate: number;
  he100_rate: number;
  dsr_active: boolean;
  night_shift_hours: number;
  insalubrity_grade: InsalubrityGrade;
  hazard_active: boolean;
  commission_rate: number;
  gratification: number;
  bonus: number;
  ats_percentage: number;
  housing_allowance: number;
  dependents_count: number;
  bank_name?: string;
  bank_code?: string;
  bank_agency?: string;
  bank_account?: string;
  bank_account_type?: BankAccountType;
  bank_holder_name?: string;
  pix_key?: string;
  vt_active: boolean;
  vt_value: number;
  va_active: boolean;
  va_value: number;
  vr_active: boolean;
  vr_value: number;
  health_plan_active: boolean;
  health_plan_employee: number;
  health_plan_dependents: number;
  dental_plan_active: boolean;
  pharmacy_allowance: number;
  life_insurance: number;
  address_zip_code?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  status: PaymentStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Dependent {
  id: string;
  employee_id: string;
  name: string;
  birth_date?: string;
  relationship: RelationshipType;
  cpf?: string;
  is_irrf_dependent: boolean;
  is_family_salary: boolean;
  created_at: string;
}

export interface Payroll {
  id: string;
  unit_id: string;
  employee_id: string;
  month: number;
  year: number;
  base_salary: number;
  he50_hours: number;
  he50_value: number;
  he100_hours: number;
  he100_value: number;
  dsr_value: number;
  night_shift_value: number;
  insalubrity_value: number;
  hazard_value: number;
  commission_value: number;
  gratification: number;
  bonus: number;
  ats_value: number;
  housing_allowance: number;
  rounding: number;
  other_earnings: number;
  absences_days: number;
  absences_value: number;
  late_hours: number;
  late_value: number;
  advance: number;
  alimony: number;
  payroll_loan: number;
  other_deductions: number;
  coparticipation: number;
  vt_discount: number;
  va_discount: number;
  health_plan_discount: number;
  inss_base: number;
  inss_rate: number;
  inss_value: number;
  irrf_base: number;
  irrf_rate: number;
  irrf_deduction: number;
  irrf_value: number;
  fgts_base: number;
  fgts_value: number;
  inss_employer: number;
  fgts_employer: number;
  rat: number;
  third_parties: number;
  total_earnings: number;
  total_deductions: number;
  net_salary: number;
  status: PaymentStatus;
  paid_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeLeave {
  id: string;
  unit_id: string;
  employee_id: string;
  type: LeaveType;
  start_date: string;
  end_date: string;
  cid10?: string;
  doctor_name?: string;
  crm?: string;
  status: LeaveStatus;
  observations?: string;
  attachment_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  unit_id: string;
  description: string;
  category: AssetCategory;
  asset_number?: string;
  acquisition_date?: string;
  acquisition_value: number;
  current_value: number;
  depreciation_rate: number;
  location?: string;
  condition: AssetCondition;
  responsible?: string;
  observations?: string;
  photo_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialAccount {
  id: string;
  unit_id: string;
  name: string;
  type: FinancialAccountType;
  bank_name?: string;
  bank_agency?: string;
  bank_account?: string;
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  unit_id: string;
  account_id?: string;
  member_id?: string;
  description: string;
  amount: number;
  date: string;
  competency_date?: string;
  type: TransactionType;
  category?: string;
  operation_nature?: string;
  cost_center?: string;
  project_id?: string;
  reference?: string;
  invoice_number?: string;
  payment_method?: PaymentMethod;
  provider_name?: string;
  provider_cpf?: string;
  provider_cnpj?: string;
  is_installment: boolean;
  installments_count?: number;
  current_installment?: number;
  parent_transaction_id?: string;
  status: PaymentStatus;
  is_reconciled: boolean;
  attachment_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface MemberContribution {
  id: string;
  unit_id: string;
  member_id: string;
  transaction_id?: string;
  type: ContributionType;
  amount: number;
  date: string;
  observations?: string;
  created_at: string;
}

export interface ChurchEvent {
  id: string;
  unit_id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  end_date?: string;
  end_time?: string;
  location?: string;
  type: EventType;
  attendees_count: number;
  max_capacity?: number;
  is_recurring: boolean;
  recurrence_pattern?: string;
  responsible?: string;
  resources_needed?: string;
  observations?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TaxBracket {
  limit: number;
  rate: number;
  deduction?: number;
}

export interface TaxConfiguration {
  id: string;
  unit_id?: string;
  name: string;
  type: TaxConfigType;
  brackets?: TaxBracket[];
  rate?: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

// Types para autenticação
export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
  roles: AppRole[];
  currentUnit?: Unit;
}
