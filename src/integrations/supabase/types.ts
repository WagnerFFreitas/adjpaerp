export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assets: {
        Row: {
          acquisition_date: string | null
          acquisition_value: number | null
          asset_number: string | null
          category: string
          condition: string | null
          created_at: string | null
          created_by: string | null
          current_value: number | null
          depreciation_rate: number | null
          description: string
          id: string
          location: string | null
          observations: string | null
          photo_url: string | null
          responsible: string | null
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          acquisition_date?: string | null
          acquisition_value?: number | null
          asset_number?: string | null
          category: string
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          depreciation_rate?: number | null
          description: string
          id?: string
          location?: string | null
          observations?: string | null
          photo_url?: string | null
          responsible?: string | null
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          acquisition_date?: string | null
          acquisition_value?: number | null
          asset_number?: string | null
          category?: string
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          depreciation_rate?: number | null
          description?: string
          id?: string
          location?: string | null
          observations?: string | null
          photo_url?: string | null
          responsible?: string | null
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity: string
          entity_id: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          unit_id: string | null
          user_agent: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          unit_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          unit_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      dependents: {
        Row: {
          birth_date: string | null
          cpf: string | null
          created_at: string | null
          employee_id: string
          id: string
          is_family_salary: boolean | null
          is_irrf_dependent: boolean | null
          name: string
          relationship: string
        }
        Insert: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          is_family_salary?: boolean | null
          is_irrf_dependent?: boolean | null
          name: string
          relationship: string
        }
        Update: {
          birth_date?: string | null
          cpf?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          is_family_salary?: boolean | null
          is_irrf_dependent?: boolean | null
          name?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "dependents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_leaves: {
        Row: {
          attachment_url: string | null
          cid10: string | null
          created_at: string | null
          created_by: string | null
          crm: string | null
          doctor_name: string | null
          employee_id: string
          end_date: string
          id: string
          observations: string | null
          start_date: string
          status: string | null
          type: string
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          cid10?: string | null
          created_at?: string | null
          created_by?: string | null
          crm?: string | null
          doctor_name?: string | null
          employee_id: string
          end_date: string
          id?: string
          observations?: string | null
          start_date: string
          status?: string | null
          type: string
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          cid10?: string | null
          created_at?: string | null
          created_by?: string | null
          crm?: string | null
          doctor_name?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          observations?: string | null
          start_date?: string
          status?: string | null
          type?: string
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_leaves_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip_code: string | null
          admission_date: string
          aso_date: string | null
          aso_expiry: string | null
          ats_percentage: number | null
          bank_account: string | null
          bank_account_type: string | null
          bank_agency: string | null
          bank_code: string | null
          bank_holder_name: string | null
          bank_name: string | null
          base_salary: number | null
          birth_date: string | null
          blood_type: string | null
          bonus: number | null
          cbo: string | null
          cnh_category: string | null
          cnh_expiry: string | null
          cnh_number: string | null
          collective_agreement: string | null
          commission_rate: number | null
          contract_type: string | null
          cpf: string | null
          created_at: string | null
          created_by: string | null
          ctps: string | null
          dental_plan_active: boolean | null
          department: string | null
          dependents_count: number | null
          disability_type: string | null
          dsr_active: boolean | null
          education_level: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          function: string | null
          gender: string | null
          gratification: number | null
          hazard_active: boolean | null
          he100_rate: number | null
          he50_rate: number | null
          health_plan_active: boolean | null
          health_plan_dependents: number | null
          health_plan_employee: number | null
          housing_allowance: number | null
          id: string
          insalubrity_grade: string | null
          is_pcd: boolean | null
          life_insurance: number | null
          marital_status: string | null
          matricula: string | null
          member_id: string | null
          name: string
          nationality: string | null
          night_shift_hours: number | null
          pharmacy_allowance: number | null
          photo_url: string | null
          pis: string | null
          pix_key: string | null
          position: string
          race_color: string | null
          reservista: string | null
          rg: string | null
          salary_type: string | null
          status: string | null
          termination_date: string | null
          titulo_eleitor: string | null
          union_name: string | null
          unit_id: string
          updated_at: string | null
          va_active: boolean | null
          va_value: number | null
          vr_active: boolean | null
          vr_value: number | null
          vt_active: boolean | null
          vt_value: number | null
          work_regime: string | null
          work_schedule: string | null
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          admission_date: string
          aso_date?: string | null
          aso_expiry?: string | null
          ats_percentage?: number | null
          bank_account?: string | null
          bank_account_type?: string | null
          bank_agency?: string | null
          bank_code?: string | null
          bank_holder_name?: string | null
          bank_name?: string | null
          base_salary?: number | null
          birth_date?: string | null
          blood_type?: string | null
          bonus?: number | null
          cbo?: string | null
          cnh_category?: string | null
          cnh_expiry?: string | null
          cnh_number?: string | null
          collective_agreement?: string | null
          commission_rate?: number | null
          contract_type?: string | null
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          ctps?: string | null
          dental_plan_active?: boolean | null
          department?: string | null
          dependents_count?: number | null
          disability_type?: string | null
          dsr_active?: boolean | null
          education_level?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          function?: string | null
          gender?: string | null
          gratification?: number | null
          hazard_active?: boolean | null
          he100_rate?: number | null
          he50_rate?: number | null
          health_plan_active?: boolean | null
          health_plan_dependents?: number | null
          health_plan_employee?: number | null
          housing_allowance?: number | null
          id?: string
          insalubrity_grade?: string | null
          is_pcd?: boolean | null
          life_insurance?: number | null
          marital_status?: string | null
          matricula?: string | null
          member_id?: string | null
          name: string
          nationality?: string | null
          night_shift_hours?: number | null
          pharmacy_allowance?: number | null
          photo_url?: string | null
          pis?: string | null
          pix_key?: string | null
          position: string
          race_color?: string | null
          reservista?: string | null
          rg?: string | null
          salary_type?: string | null
          status?: string | null
          termination_date?: string | null
          titulo_eleitor?: string | null
          union_name?: string | null
          unit_id: string
          updated_at?: string | null
          va_active?: boolean | null
          va_value?: number | null
          vr_active?: boolean | null
          vr_value?: number | null
          vt_active?: boolean | null
          vt_value?: number | null
          work_regime?: string | null
          work_schedule?: string | null
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          admission_date?: string
          aso_date?: string | null
          aso_expiry?: string | null
          ats_percentage?: number | null
          bank_account?: string | null
          bank_account_type?: string | null
          bank_agency?: string | null
          bank_code?: string | null
          bank_holder_name?: string | null
          bank_name?: string | null
          base_salary?: number | null
          birth_date?: string | null
          blood_type?: string | null
          bonus?: number | null
          cbo?: string | null
          cnh_category?: string | null
          cnh_expiry?: string | null
          cnh_number?: string | null
          collective_agreement?: string | null
          commission_rate?: number | null
          contract_type?: string | null
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          ctps?: string | null
          dental_plan_active?: boolean | null
          department?: string | null
          dependents_count?: number | null
          disability_type?: string | null
          dsr_active?: boolean | null
          education_level?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          function?: string | null
          gender?: string | null
          gratification?: number | null
          hazard_active?: boolean | null
          he100_rate?: number | null
          he50_rate?: number | null
          health_plan_active?: boolean | null
          health_plan_dependents?: number | null
          health_plan_employee?: number | null
          housing_allowance?: number | null
          id?: string
          insalubrity_grade?: string | null
          is_pcd?: boolean | null
          life_insurance?: number | null
          marital_status?: string | null
          matricula?: string | null
          member_id?: string | null
          name?: string
          nationality?: string | null
          night_shift_hours?: number | null
          pharmacy_allowance?: number | null
          photo_url?: string | null
          pis?: string | null
          pix_key?: string | null
          position?: string
          race_color?: string | null
          reservista?: string | null
          rg?: string | null
          salary_type?: string | null
          status?: string | null
          termination_date?: string | null
          titulo_eleitor?: string | null
          union_name?: string | null
          unit_id?: string
          updated_at?: string | null
          va_active?: boolean | null
          va_value?: number | null
          vr_active?: boolean | null
          vr_value?: number | null
          vt_active?: boolean | null
          vt_value?: number | null
          work_regime?: string | null
          work_schedule?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          attendees_count: number | null
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          end_date: string | null
          end_time: string | null
          id: string
          is_recurring: boolean | null
          location: string | null
          max_capacity: number | null
          observations: string | null
          recurrence_pattern: string | null
          resources_needed: string | null
          responsible: string | null
          time: string | null
          title: string
          type: string | null
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          attendees_count?: number | null
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          max_capacity?: number | null
          observations?: string | null
          recurrence_pattern?: string | null
          resources_needed?: string | null
          responsible?: string | null
          time?: string | null
          title: string
          type?: string | null
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          attendees_count?: number | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          end_date?: string | null
          end_time?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          max_capacity?: number | null
          observations?: string | null
          recurrence_pattern?: string | null
          resources_needed?: string | null
          responsible?: string | null
          time?: string | null
          title?: string
          type?: string | null
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_accounts: {
        Row: {
          bank_account: string | null
          bank_agency: string | null
          bank_name: string | null
          created_at: string | null
          current_balance: number | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          bank_account?: string | null
          bank_agency?: string | null
          bank_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          bank_account?: string | null
          bank_agency?: string | null
          bank_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_accounts_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      member_contributions: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          member_id: string
          observations: string | null
          transaction_id: string | null
          type: string
          unit_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          id?: string
          member_id: string
          observations?: string | null
          transaction_id?: string | null
          type: string
          unit_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          member_id?: string
          observations?: string | null
          transaction_id?: string | null
          type?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_contributions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_contributions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_contributions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip_code: string | null
          avatar_url: string | null
          baptism_church: string | null
          baptism_date: string | null
          baptizing_pastor: string | null
          biblical_school: string | null
          birth_date: string | null
          blood_type: string | null
          cell_group: string | null
          church_of_origin: string | null
          consecration_date: string | null
          conversion_date: string | null
          conversion_place: string | null
          cpf: string | null
          created_at: string | null
          created_by: string | null
          discipleship_course: string | null
          ecclesiastical_position: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          gender: string | null
          holy_spirit_baptism: string | null
          id: string
          is_regular_giver: boolean | null
          is_tithable: boolean | null
          main_ministry: string | null
          marital_status: string | null
          membership_date: string | null
          ministry_role: string | null
          name: string
          observations: string | null
          other_ministries: string[] | null
          participates_campaigns: boolean | null
          phone: string | null
          profession: string | null
          rg: string | null
          role: string | null
          special_needs: string | null
          spiritual_gifts: string | null
          status: string | null
          talents: string | null
          unit_id: string
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          avatar_url?: string | null
          baptism_church?: string | null
          baptism_date?: string | null
          baptizing_pastor?: string | null
          biblical_school?: string | null
          birth_date?: string | null
          blood_type?: string | null
          cell_group?: string | null
          church_of_origin?: string | null
          consecration_date?: string | null
          conversion_date?: string | null
          conversion_place?: string | null
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          discipleship_course?: string | null
          ecclesiastical_position?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          gender?: string | null
          holy_spirit_baptism?: string | null
          id?: string
          is_regular_giver?: boolean | null
          is_tithable?: boolean | null
          main_ministry?: string | null
          marital_status?: string | null
          membership_date?: string | null
          ministry_role?: string | null
          name: string
          observations?: string | null
          other_ministries?: string[] | null
          participates_campaigns?: boolean | null
          phone?: string | null
          profession?: string | null
          rg?: string | null
          role?: string | null
          special_needs?: string | null
          spiritual_gifts?: string | null
          status?: string | null
          talents?: string | null
          unit_id: string
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip_code?: string | null
          avatar_url?: string | null
          baptism_church?: string | null
          baptism_date?: string | null
          baptizing_pastor?: string | null
          biblical_school?: string | null
          birth_date?: string | null
          blood_type?: string | null
          cell_group?: string | null
          church_of_origin?: string | null
          consecration_date?: string | null
          conversion_date?: string | null
          conversion_place?: string | null
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          discipleship_course?: string | null
          ecclesiastical_position?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          gender?: string | null
          holy_spirit_baptism?: string | null
          id?: string
          is_regular_giver?: boolean | null
          is_tithable?: boolean | null
          main_ministry?: string | null
          marital_status?: string | null
          membership_date?: string | null
          ministry_role?: string | null
          name?: string
          observations?: string | null
          other_ministries?: string[] | null
          participates_campaigns?: boolean | null
          phone?: string | null
          profession?: string | null
          rg?: string | null
          role?: string | null
          special_needs?: string | null
          spiritual_gifts?: string | null
          status?: string | null
          talents?: string | null
          unit_id?: string
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      payrolls: {
        Row: {
          absences_days: number | null
          absences_value: number | null
          advance: number | null
          alimony: number | null
          ats_value: number | null
          base_salary: number | null
          bonus: number | null
          commission_value: number | null
          coparticipation: number | null
          created_at: string | null
          created_by: string | null
          dsr_value: number | null
          employee_id: string
          fgts_base: number | null
          fgts_employer: number | null
          fgts_value: number | null
          gratification: number | null
          hazard_value: number | null
          he100_hours: number | null
          he100_value: number | null
          he50_hours: number | null
          he50_value: number | null
          health_plan_discount: number | null
          housing_allowance: number | null
          id: string
          insalubrity_value: number | null
          inss_base: number | null
          inss_employer: number | null
          inss_rate: number | null
          inss_value: number | null
          irrf_base: number | null
          irrf_deduction: number | null
          irrf_rate: number | null
          irrf_value: number | null
          late_hours: number | null
          late_value: number | null
          month: number
          net_salary: number | null
          night_shift_value: number | null
          other_deductions: number | null
          other_earnings: number | null
          paid_at: string | null
          payroll_loan: number | null
          rat: number | null
          rounding: number | null
          status: string | null
          third_parties: number | null
          total_deductions: number | null
          total_earnings: number | null
          unit_id: string
          updated_at: string | null
          va_discount: number | null
          vt_discount: number | null
          year: number
        }
        Insert: {
          absences_days?: number | null
          absences_value?: number | null
          advance?: number | null
          alimony?: number | null
          ats_value?: number | null
          base_salary?: number | null
          bonus?: number | null
          commission_value?: number | null
          coparticipation?: number | null
          created_at?: string | null
          created_by?: string | null
          dsr_value?: number | null
          employee_id: string
          fgts_base?: number | null
          fgts_employer?: number | null
          fgts_value?: number | null
          gratification?: number | null
          hazard_value?: number | null
          he100_hours?: number | null
          he100_value?: number | null
          he50_hours?: number | null
          he50_value?: number | null
          health_plan_discount?: number | null
          housing_allowance?: number | null
          id?: string
          insalubrity_value?: number | null
          inss_base?: number | null
          inss_employer?: number | null
          inss_rate?: number | null
          inss_value?: number | null
          irrf_base?: number | null
          irrf_deduction?: number | null
          irrf_rate?: number | null
          irrf_value?: number | null
          late_hours?: number | null
          late_value?: number | null
          month: number
          net_salary?: number | null
          night_shift_value?: number | null
          other_deductions?: number | null
          other_earnings?: number | null
          paid_at?: string | null
          payroll_loan?: number | null
          rat?: number | null
          rounding?: number | null
          status?: string | null
          third_parties?: number | null
          total_deductions?: number | null
          total_earnings?: number | null
          unit_id: string
          updated_at?: string | null
          va_discount?: number | null
          vt_discount?: number | null
          year: number
        }
        Update: {
          absences_days?: number | null
          absences_value?: number | null
          advance?: number | null
          alimony?: number | null
          ats_value?: number | null
          base_salary?: number | null
          bonus?: number | null
          commission_value?: number | null
          coparticipation?: number | null
          created_at?: string | null
          created_by?: string | null
          dsr_value?: number | null
          employee_id?: string
          fgts_base?: number | null
          fgts_employer?: number | null
          fgts_value?: number | null
          gratification?: number | null
          hazard_value?: number | null
          he100_hours?: number | null
          he100_value?: number | null
          he50_hours?: number | null
          he50_value?: number | null
          health_plan_discount?: number | null
          housing_allowance?: number | null
          id?: string
          insalubrity_value?: number | null
          inss_base?: number | null
          inss_employer?: number | null
          inss_rate?: number | null
          inss_value?: number | null
          irrf_base?: number | null
          irrf_deduction?: number | null
          irrf_rate?: number | null
          irrf_value?: number | null
          late_hours?: number | null
          late_value?: number | null
          month?: number
          net_salary?: number | null
          night_shift_value?: number | null
          other_deductions?: number | null
          other_earnings?: number | null
          paid_at?: string | null
          payroll_loan?: number | null
          rat?: number | null
          rounding?: number | null
          status?: string | null
          third_parties?: number | null
          total_deductions?: number | null
          total_earnings?: number | null
          unit_id?: string
          updated_at?: string | null
          va_discount?: number | null
          vt_discount?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "payrolls_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payrolls_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          default_unit_id: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          default_unit_id?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          default_unit_id?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_default_unit_id_fkey"
            columns: ["default_unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_configurations: {
        Row: {
          brackets: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          rate: number | null
          type: string
          unit_id: string | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          brackets?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rate?: number | null
          type: string
          unit_id?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          brackets?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rate?: number | null
          type?: string
          unit_id?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_configurations_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string | null
          amount: number
          attachment_url: string | null
          category: string | null
          competency_date: string | null
          cost_center: string | null
          created_at: string | null
          created_by: string | null
          current_installment: number | null
          date: string
          description: string
          id: string
          installments_count: number | null
          invoice_number: string | null
          is_installment: boolean | null
          is_reconciled: boolean | null
          member_id: string | null
          operation_nature: string | null
          parent_transaction_id: string | null
          payment_method: string | null
          project_id: string | null
          provider_cnpj: string | null
          provider_cpf: string | null
          provider_name: string | null
          reference: string | null
          status: string | null
          type: string
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          amount: number
          attachment_url?: string | null
          category?: string | null
          competency_date?: string | null
          cost_center?: string | null
          created_at?: string | null
          created_by?: string | null
          current_installment?: number | null
          date: string
          description: string
          id?: string
          installments_count?: number | null
          invoice_number?: string | null
          is_installment?: boolean | null
          is_reconciled?: boolean | null
          member_id?: string | null
          operation_nature?: string | null
          parent_transaction_id?: string | null
          payment_method?: string | null
          project_id?: string | null
          provider_cnpj?: string | null
          provider_cpf?: string | null
          provider_name?: string | null
          reference?: string | null
          status?: string | null
          type: string
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number
          attachment_url?: string | null
          category?: string | null
          competency_date?: string | null
          cost_center?: string | null
          created_at?: string | null
          created_by?: string | null
          current_installment?: number | null
          date?: string
          description?: string
          id?: string
          installments_count?: number | null
          invoice_number?: string | null
          is_installment?: boolean | null
          is_reconciled?: boolean | null
          member_id?: string | null
          operation_nature?: string | null
          parent_transaction_id?: string | null
          payment_method?: string | null
          project_id?: string | null
          provider_cnpj?: string | null
          provider_cpf?: string | null
          provider_name?: string | null
          reference?: string | null
          status?: string | null
          type?: string
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          created_at: string | null
          email: string | null
          id: string
          is_headquarter: boolean | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_headquarter?: boolean | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_headquarter?: boolean | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          unit_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          unit_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          unit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_email_by_username: { Args: { p_username: string }; Returns: string }
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
