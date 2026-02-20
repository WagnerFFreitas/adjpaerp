-- =====================================================
-- ADJPA ERP - FUNÇÕES E TRIGGERS
-- =====================================================

\c adjpa_erp

-- 1. FUNÇÃO DE UPDATED_AT AUTOMÁTICO
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER set_updated_at_units 
  BEFORE UPDATE ON units 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_users 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_profiles 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_members 
  BEFORE UPDATE ON members 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_employees 
  BEFORE UPDATE ON employees 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_payrolls 
  BEFORE UPDATE ON payrolls 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_employee_leaves 
  BEFORE UPDATE ON employee_leaves 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_assets 
  BEFORE UPDATE ON assets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_financial_accounts 
  BEFORE UPDATE ON financial_accounts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_transactions 
  BEFORE UPDATE ON transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_events 
  BEFORE UPDATE ON events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_tax_configurations 
  BEFORE UPDATE ON tax_configurations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO profiles (user_id, name, username, email)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),
    lower(split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_created
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_new_user();

-- 3. FUNÇÃO DE VERIFICAÇÃO DE PAPEL
-- =====================================================

CREATE OR REPLACE FUNCTION has_role(p_user_id UUID, p_role TEXT)
RETURNS BOOLEAN AS $
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = p_user_id
      AND role = p_role
  );
END;
$ LANGUAGE plpgsql STABLE;

-- 4. FUNÇÃO DE HASH DE SENHA
-- =====================================================

CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $
BEGIN
  RETURN crypt(password, gen_salt('bf', 10));
END;
$ LANGUAGE plpgsql;

-- 5. FUNÇÃO DE VERIFICAÇÃO DE SENHA
-- =====================================================

CREATE OR REPLACE FUNCTION verify_password(password TEXT, password_hash TEXT)
RETURNS BOOLEAN AS $
BEGIN
  RETURN password_hash = crypt(password, password_hash);
END;
$ LANGUAGE plpgsql;

-- 6. FUNÇÃO DE LOGIN
-- =====================================================

CREATE OR REPLACE FUNCTION login(p_email TEXT, p_password TEXT)
RETURNS TABLE(
  user_id UUID,
  token TEXT,
  success BOOLEAN,
  message TEXT
) AS $
DECLARE
  v_user_id UUID;
  v_password_hash TEXT;
  v_token TEXT;
BEGIN
  -- Buscar usuário
  SELECT id, password_hash INTO v_user_id, v_password_hash
  FROM users
  WHERE email = p_email;
  
  -- Verificar se usuário existe
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, NULL::TEXT, false, 'Usuário não encontrado';
    RETURN;
  END IF;
  
  -- Verificar senha
  IF NOT verify_password(p_password, v_password_hash) THEN
    RETURN QUERY SELECT NULL::UUID, NULL::TEXT, false, 'Senha incorreta';
    RETURN;
  END IF;
  
  -- Gerar token
  v_token := encode(gen_random_bytes(32), 'base64');
  
  -- Criar sessão
  INSERT INTO user_sessions (user_id, token, expires_at)
  VALUES (v_user_id, v_token, now() + INTERVAL '7 days');
  
  -- Atualizar último login
  UPDATE users SET last_sign_in_at = now() WHERE id = v_user_id;
  
  RETURN QUERY SELECT v_user_id, v_token, true, 'Login realizado com sucesso';
END;
$ LANGUAGE plpgsql;


-- 7. FUNÇÃO DE LOGOUT
-- =====================================================

CREATE OR REPLACE FUNCTION logout(p_token TEXT)
RETURNS BOOLEAN AS $
BEGIN
  DELETE FROM user_sessions WHERE token = p_token;
  RETURN FOUND;
END;
$ LANGUAGE plpgsql;

-- 8. FUNÇÃO DE VALIDAÇÃO DE TOKEN
-- =====================================================

CREATE OR REPLACE FUNCTION validate_token(p_token TEXT)
RETURNS TABLE(
  user_id UUID,
  valid BOOLEAN
) AS $
BEGIN
  RETURN QUERY
  SELECT 
    us.user_id,
    (us.expires_at > now()) as valid
  FROM user_sessions us
  WHERE us.token = p_token;
END;
$ LANGUAGE plpgsql;

-- 9. FUNÇÃO DE AUDITORIA AUTOMÁTICA
-- =====================================================

CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $
DECLARE
  v_user_id UUID;
  v_user_name TEXT;
BEGIN
  -- Tentar obter user_id do contexto (será configurado pela aplicação)
  v_user_id := current_setting('app.current_user_id', true)::UUID;
  v_user_name := current_setting('app.current_user_name', true);
  
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      user_id, user_name, action, entity, entity_id, new_data
    ) VALUES (
      v_user_id, v_user_name, 'INSERT', TG_TABLE_NAME, NEW.id::TEXT, row_to_json(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      user_id, user_name, action, entity, entity_id, old_data, new_data
    ) VALUES (
      v_user_id, v_user_name, 'UPDATE', TG_TABLE_NAME, NEW.id::TEXT, 
      row_to_json(OLD), row_to_json(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      user_id, user_name, action, entity, entity_id, old_data
    ) VALUES (
      v_user_id, v_user_name, 'DELETE', TG_TABLE_NAME, OLD.id::TEXT, row_to_json(OLD)
    );
    RETURN OLD;
  END IF;
END;
$ LANGUAGE plpgsql;

-- Aplicar auditoria nas tabelas principais
CREATE TRIGGER audit_members 
  AFTER INSERT OR UPDATE OR DELETE ON members 
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_employees 
  AFTER INSERT OR UPDATE OR DELETE ON employees 
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_transactions 
  AFTER INSERT OR UPDATE OR DELETE ON transactions 
  FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_payrolls 
  AFTER INSERT OR UPDATE OR DELETE ON payrolls 
  FOR EACH ROW EXECUTE FUNCTION log_audit();

-- 10. FUNÇÃO DE BUSCA DE EMAIL POR USERNAME
-- =====================================================

CREATE OR REPLACE FUNCTION get_email_by_username(p_username TEXT)
RETURNS TEXT AS $
BEGIN
  RETURN (
    SELECT email
    FROM profiles
    WHERE LOWER(username) = LOWER(p_username)
    LIMIT 1
  );
END;
$ LANGUAGE plpgsql STABLE;

-- 11. FUNÇÃO DE CÁLCULO DE FOLHA DE PAGAMENTO
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_payroll(
  p_employee_id UUID,
  p_month INTEGER,
  p_year INTEGER
)
RETURNS UUID AS $
DECLARE
  v_payroll_id UUID;
  v_employee RECORD;
  v_total_earnings DECIMAL(12,2);
  v_total_deductions DECIMAL(12,2);
  v_net_salary DECIMAL(12,2);
BEGIN
  -- Buscar dados do funcionário
  SELECT * INTO v_employee FROM employees WHERE id = p_employee_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Funcionário não encontrado';
  END IF;
  
  -- Criar ou atualizar folha
  INSERT INTO payrolls (
    unit_id, employee_id, month, year,
    base_salary, total_earnings, total_deductions, net_salary
  ) VALUES (
    v_employee.unit_id, p_employee_id, p_month, p_year,
    v_employee.base_salary, v_employee.base_salary, 0, v_employee.base_salary
  )
  ON CONFLICT (employee_id, month, year) 
  DO UPDATE SET
    base_salary = v_employee.base_salary,
    updated_at = now()
  RETURNING id INTO v_payroll_id;
  
  RETURN v_payroll_id;
END;
$ LANGUAGE plpgsql;

-- 12. FUNÇÃO DE ATUALIZAÇÃO DE SALDO DE CONTA
-- =====================================================

CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $
DECLARE
  v_amount DECIMAL(14,2);
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_amount := CASE 
      WHEN NEW.type = 'INCOME' THEN NEW.amount
      WHEN NEW.type = 'EXPENSE' THEN -NEW.amount
    END;
    
    UPDATE financial_accounts
    SET current_balance = current_balance + v_amount
    WHERE id = NEW.account_id;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Reverter valor antigo
    v_amount := CASE 
      WHEN OLD.type = 'INCOME' THEN -OLD.amount
      WHEN OLD.type = 'EXPENSE' THEN OLD.amount
    END;
    
    UPDATE financial_accounts
    SET current_balance = current_balance + v_amount
    WHERE id = OLD.account_id;
    
    -- Aplicar novo valor
    v_amount := CASE 
      WHEN NEW.type = 'INCOME' THEN NEW.amount
      WHEN NEW.type = 'EXPENSE' THEN -NEW.amount
    END;
    
    UPDATE financial_accounts
    SET current_balance = current_balance + v_amount
    WHERE id = NEW.account_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    v_amount := CASE 
      WHEN OLD.type = 'INCOME' THEN -OLD.amount
      WHEN OLD.type = 'EXPENSE' THEN OLD.amount
    END;
    
    UPDATE financial_accounts
    SET current_balance = current_balance + v_amount
    WHERE id = OLD.account_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER update_balance_on_transaction
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW 
  WHEN (NEW.status = 'PAID' OR OLD.status = 'PAID')
  EXECUTE FUNCTION update_account_balance();

\echo 'Funções e triggers criados com sucesso!'
