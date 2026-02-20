-- =====================================================
-- ADJPA ERP - DADOS INICIAIS
-- =====================================================

\c adjpa_erp

-- 1. INSERIR UNIDADE SEDE
-- =====================================================

INSERT INTO units (name, is_headquarter, city, state)
VALUES ('AD Jesus Pão que Alimenta - Sede', true, 'Sua Cidade', 'SP')
ON CONFLICT DO NOTHING;

-- 2. CRIAR USUÁRIO DESENVOLVEDOR (SUPER ADMIN)
-- =====================================================

DO $
DECLARE
  v_dev_user_id UUID;
  v_unit_id UUID;
BEGIN
  -- Buscar ID da unidade sede
  SELECT id INTO v_unit_id FROM units WHERE is_headquarter = true LIMIT 1;
  
  -- Criar usuário desenvolvedor
  INSERT INTO users (email, password_hash, email_confirmed)
  VALUES ('desenvolvedor@adjpa.com', hash_password('dev@ecclesia_secure_2024'), true)
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_dev_user_id;
  
  -- Se usuário já existia, buscar ID
  IF v_dev_user_id IS NULL THEN
    SELECT id INTO v_dev_user_id FROM users WHERE email = 'desenvolvedor@adjpa.com';
  END IF;
  
  -- Atualizar perfil
  UPDATE profiles 
  SET name = 'Desenvolvedor', 
      username = 'desenvolvedor',
      default_unit_id = v_unit_id
  WHERE user_id = v_dev_user_id;
  
  -- Adicionar role de developer (super admin)
  INSERT INTO user_roles (user_id, role, unit_id)
  VALUES (v_dev_user_id, 'developer', v_unit_id)
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Usuário desenvolvedor criado:';
  RAISE NOTICE '  Email: desenvolvedor@adjpa.com';
  RAISE NOTICE '  Senha: dev@ecclesia_secure_2024';
  RAISE NOTICE '  Acesso: TOTAL (configurações fiscais, certificados, BD, etc)';
END;
$;

-- 3. CRIAR USUÁRIO ADMINISTRADOR PADRÃO
-- =====================================================

DO $
DECLARE
  v_user_id UUID;
  v_unit_id UUID;
BEGIN
  -- Buscar ID da unidade sede
  SELECT id INTO v_unit_id FROM units WHERE is_headquarter = true LIMIT 1;
  
  -- Criar usuário admin
  INSERT INTO users (email, password_hash, email_confirmed)
  VALUES ('admin@adjpa.com', hash_password('admin123'), true)
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO v_user_id;
  
  -- Se usuário já existia, buscar ID
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM users WHERE email = 'admin@adjpa.com';
  END IF;
  
  -- Atualizar perfil
  UPDATE profiles 
  SET name = 'Administrador Inicial', 
      username = 'admin',
      default_unit_id = v_unit_id
  WHERE user_id = v_user_id;
  
  -- Adicionar role de admin
  INSERT INTO user_roles (user_id, role, unit_id)
  VALUES (v_user_id, 'admin', v_unit_id)
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Usuário administrador criado:';
  RAISE NOTICE '  Email: admin@adjpa.com';
  RAISE NOTICE '  Senha: admin123';
  RAISE NOTICE '  IMPORTANTE: Altere a senha após o primeiro login!';
END;
$;

-- 4. CONFIGURAÇÕES FISCAIS PADRÃO (2024)
-- =====================================================

-- INSS 2024
INSERT INTO tax_configurations (name, type, brackets, is_active, valid_from)
VALUES (
  'INSS 2024',
  'INSS',
  '[
    {"limit": 1412.00, "rate": 7.5},
    {"limit": 2666.68, "rate": 9.0},
    {"limit": 4000.03, "rate": 12.0},
    {"limit": 7786.02, "rate": 14.0}
  ]'::jsonb,
  true,
  '2024-01-01'
) ON CONFLICT DO NOTHING;

-- IRRF 2024
INSERT INTO tax_configurations (name, type, brackets, is_active, valid_from)
VALUES (
  'IRRF 2024',
  'IRRF',
  '[
    {"limit": 2259.20, "rate": 0, "deduction": 0},
    {"limit": 2826.65, "rate": 7.5, "deduction": 169.44},
    {"limit": 3751.05, "rate": 15.0, "deduction": 381.44},
    {"limit": 4664.68, "rate": 22.5, "deduction": 662.77},
    {"limit": 999999.99, "rate": 27.5, "deduction": 896.00}
  ]'::jsonb,
  true,
  '2024-01-01'
) ON CONFLICT DO NOTHING;

-- FGTS
INSERT INTO tax_configurations (name, type, rate, is_active, valid_from)
VALUES ('FGTS 2024', 'FGTS', 8.0, true, '2024-01-01')
ON CONFLICT DO NOTHING;

-- Encargos Patronais
INSERT INTO tax_configurations (name, type, rate, is_active, valid_from)
VALUES ('INSS Patronal 2024', 'PATRONAL', 20.0, true, '2024-01-01')
ON CONFLICT DO NOTHING;

-- RAT (Risco Ambiental do Trabalho) - Padrão médio
INSERT INTO tax_configurations (name, type, rate, is_active, valid_from)
VALUES ('RAT 2024', 'RAT', 2.0, true, '2024-01-01')
ON CONFLICT DO NOTHING;

-- 5. CATEGORIAS FINANCEIRAS PADRÃO
-- =====================================================

-- Criar conta caixa padrão
DO $
DECLARE
  v_unit_id UUID;
BEGIN
  SELECT id INTO v_unit_id FROM units WHERE is_headquarter = true LIMIT 1;
  
  INSERT INTO financial_accounts (unit_id, name, type, current_balance, is_active)
  VALUES 
    (v_unit_id, 'Caixa Geral', 'CASH', 0, true),
    (v_unit_id, 'Conta Corrente Principal', 'BANK', 0, true)
  ON CONFLICT DO NOTHING;
END;
$;

\echo ''
\echo '========================================='
\echo 'Dados iniciais inseridos com sucesso!'
\echo '========================================='
\echo ''
\echo 'CREDENCIAIS DE ACESSO:'
\echo ''
\echo '1. DESENVOLVEDOR (Acesso Total):'
\echo '   Email: desenvolvedor@adjpa.com'
\echo '   Senha: dev@ecclesia_secure_2024'
\echo '   Acesso: Configurações fiscais, certificados, BD, etc'
\echo ''
\echo '2. ADMINISTRADOR INICIAL (Alterar após primeiro login):'
\echo '   Email: admin@adjpa.com'
\echo '   Senha: admin123'
\echo '   Acesso: Gestão geral do sistema'
\echo ''
\echo 'IMPORTANTE:'
\echo '  1. Altere a senha do administrador após primeiro login'
\echo '  2. Configure os dados da sua unidade'
\echo '  3. Crie usuários adicionais'
\echo '  4. Revise as configurações fiscais'
\echo '  5. Mantenha as credenciais do desenvolvedor seguras'
\echo ''
