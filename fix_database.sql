-- =====================================================
-- ADJPA ERP - Correção das Funções SQL
-- =====================================================

\c adjpa_erp

-- 1. FUNÇÃO DE HASH DE SENHA
-- =====================================================

CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql;

-- 2. FUNÇÃO DE VERIFICAÇÃO DE SENHA
-- =====================================================

CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql;

-- 3. FUNÇÃO DE LOGIN SIMPLIFICADA
-- =====================================================

CREATE OR REPLACE FUNCTION login(p_email TEXT, p_password TEXT)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  user_id UUID,
  token TEXT
) AS $$
DECLARE
  v_user_id UUID;
  v_password_hash TEXT;
  v_token TEXT;
BEGIN
  -- Buscar usuário
  SELECT id, password_hash INTO v_user_id, v_password_hash
  FROM users
  WHERE email = p_email AND email_confirmed = true;

  -- Verificar se usuário existe
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'Usuário não encontrado'::TEXT, NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Verificar senha
  IF NOT verify_password(p_password, v_password_hash) THEN
    RETURN QUERY SELECT false, 'Senha incorreta'::TEXT, NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Gerar token simples
  v_token := encode(gen_random_bytes(32), 'base64');

  -- Registrar sessão
  INSERT INTO user_sessions (user_id, token, expires_at)
  VALUES (v_user_id, v_token, now() + INTERVAL '7 days');

  -- Atualizar último login
  UPDATE users SET last_sign_in_at = now() WHERE id = v_user_id;

  -- Retornar sucesso
  RETURN QUERY SELECT true, 'Login realizado com sucesso'::TEXT, v_user_id, v_token;
END;
$$ LANGUAGE plpgsql;

-- 4. INSERIR USUÁRIOS
-- =====================================================

-- Inserir usuário admin
INSERT INTO users (email, password_hash, email_confirmed)
VALUES ('admin@adjpa.com', hash_password('Admin@123'), true)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = hash_password('Admin@123');

-- Inserir usuário desenvolvedor
INSERT INTO users (email, password_hash, email_confirmed)
VALUES ('desenvolvedor@adjpa.com', hash_password('dev@ecclesia_secure_2024'), true)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = hash_password('dev@ecclesia_secure_2024');

-- 5. CRIAR PERFIS
-- =====================================================

-- Perfil admin
INSERT INTO profiles (user_id, name, username, email)
SELECT u.id, 'Administrador', 'admin', u.email
FROM users u WHERE u.email = 'admin@adjpa.com'
ON CONFLICT (user_id) DO UPDATE SET
  name = 'Administrador',
  username = 'admin';

-- Perfil desenvolvedor
INSERT INTO profiles (user_id, name, username, email)
SELECT u.id, 'Desenvolvedor', 'desenvolvedor', u.email
FROM users u WHERE u.email = 'desenvolvedor@adjpa.com'
ON CONFLICT (user_id) DO UPDATE SET
  name = 'Desenvolvedor',
  username = 'desenvolvedor';

-- 6. CRIAR ROLES
-- =====================================================

-- Role admin
INSERT INTO user_roles (user_id, role, unit_id)
SELECT u.id, 'admin', un.id
FROM users u, units un
WHERE u.email = 'admin@adjpa.com' AND un.is_headquarter = true
ON CONFLICT DO NOTHING;

-- Role developer
INSERT INTO user_roles (user_id, role, unit_id)
SELECT u.id, 'developer', un.id
FROM users u, units un
WHERE u.email = 'desenvolvedor@adjpa.com' AND un.is_headquarter = true
ON CONFLICT DO NOTHING;

-- 7. VERIFICAR CRIAÇÃO
-- =====================================================

SELECT 
  u.email,
  p.name,
  array_agg(ur.role) as roles
FROM users u
LEFT JOIN profiles p ON p.user_id = u.id
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email IN ('admin@adjpa.com', 'desenvolvedor@adjpa.com')
GROUP BY u.id, u.email, p.name;

\echo ''
\echo '========================================='
\echo 'Correção das funções SQL concluída!'
\echo '========================================='
\echo ''
\echo 'Usuários criados:'
\echo '  admin@adjpa.com / Admin@123'
\echo '  desenvolvedor@adjpa.com / dev@ecclesia_secure_2024'
\echo ''