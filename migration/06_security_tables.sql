-- =====================================================
-- ADJPA ERP - TABELAS DE SEGURANÇA
-- Migration 06 - Segurança Avançada
-- =====================================================

\c adjpa_erp

-- =====================================================
-- 1. TABELA DE LOGS DE SEGURANÇA
-- =====================================================

CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET,
  user_agent TEXT,
  attack_type TEXT NOT NULL CHECK (attack_type IN (
    'SQL_INJECTION_ATTEMPT',
    'XSS_ATTEMPT', 
    'BRUTE_FORCE_LOGIN',
    'UNAUTHORIZED_ACCESS',
    'SLOW_REQUEST',
    'ERROR_REQUEST',
    'SUSPICIOUS_ACTIVITY'
  )),
  request_data JSONB,
  blocked BOOLEAN DEFAULT true,
  severity TEXT DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_security_logs_ip ON security_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_type ON security_logs(attack_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_date ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_blocked ON security_logs(blocked);

-- =====================================================
-- 2. TABELA DE TENTATIVAS DE LOGIN
-- =====================================================

CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET NOT NULL,
  email TEXT,
  success BOOLEAN DEFAULT false,
  user_agent TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_date ON login_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_attempts_success ON login_attempts(success);

-- =====================================================
-- 3. TABELA DE IPS BLOQUEADOS
-- =====================================================

CREATE TABLE IF NOT EXISTS blocked_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET UNIQUE NOT NULL,
  reason TEXT NOT NULL,
  blocked_until TIMESTAMPTZ,
  permanent BOOLEAN DEFAULT false,
  attempts_count INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_until ON blocked_ips(blocked_until);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_permanent ON blocked_ips(permanent);

-- =====================================================
-- 4. TABELA DE CONFIGURAÇÕES DE SEGURANÇA
-- =====================================================

CREATE TABLE IF NOT EXISTS security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'GENERAL' CHECK (category IN (
    'GENERAL', 'LOGIN', 'PASSWORD', 'RATE_LIMIT', 'MONITORING'
  )),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_security_settings_key ON security_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_security_settings_category ON security_settings(category);
CREATE INDEX IF NOT EXISTS idx_security_settings_active ON security_settings(is_active);

-- =====================================================
-- 5. INSERIR CONFIGURAÇÕES PADRÃO DE SEGURANÇA
-- =====================================================

INSERT INTO security_settings (setting_key, setting_value, description, category) VALUES
-- Configurações de Login
('MAX_LOGIN_ATTEMPTS', '5', 'Máximo de tentativas de login por IP', 'LOGIN'),
('LOGIN_BLOCK_DURATION', '900', 'Duração do bloqueio em segundos (15 min)', 'LOGIN'),
('SESSION_TIMEOUT', '86400', 'Timeout da sessão em segundos (24h)', 'LOGIN'),

-- Configurações de Senha
('MIN_PASSWORD_LENGTH', '8', 'Comprimento mínimo da senha', 'PASSWORD'),
('REQUIRE_SPECIAL_CHARS', 'true', 'Exigir caracteres especiais na senha', 'PASSWORD'),
('REQUIRE_NUMBERS', 'true', 'Exigir números na senha', 'PASSWORD'),
('REQUIRE_UPPERCASE', 'true', 'Exigir letras maiúsculas na senha', 'PASSWORD'),
('PASSWORD_EXPIRY_DAYS', '90', 'Dias para expiração da senha', 'PASSWORD'),

-- Rate Limiting
('RATE_LIMIT_WINDOW', '900', 'Janela de rate limit em segundos (15 min)', 'RATE_LIMIT'),
('RATE_LIMIT_MAX_REQUESTS', '100', 'Máximo de requests por janela', 'RATE_LIMIT'),
('API_RATE_LIMIT_MAX', '1000', 'Máximo de requests API por hora', 'RATE_LIMIT'),

-- Monitoramento
('LOG_FAILED_LOGINS', 'true', 'Registrar tentativas de login falhadas', 'MONITORING'),
('LOG_SLOW_QUERIES', 'true', 'Registrar queries lentas', 'MONITORING'),
('SLOW_QUERY_THRESHOLD', '5000', 'Threshold para query lenta (ms)', 'MONITORING'),
('ENABLE_AUDIT_LOG', 'true', 'Habilitar log de auditoria', 'MONITORING')

ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- 6. FUNÇÕES DE SEGURANÇA
-- =====================================================

-- Função para verificar se IP está bloqueado
CREATE OR REPLACE FUNCTION is_ip_blocked(p_ip_address INET)
RETURNS BOOLEAN AS $$
DECLARE
  blocked_record RECORD;
BEGIN
  SELECT * INTO blocked_record
  FROM blocked_ips 
  WHERE ip_address = p_ip_address
    AND (permanent = true OR blocked_until > NOW());
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Função para bloquear IP
CREATE OR REPLACE FUNCTION block_ip(
  p_ip_address INET,
  p_reason TEXT,
  p_duration_seconds INTEGER DEFAULT NULL,
  p_permanent BOOLEAN DEFAULT false
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO blocked_ips (
    ip_address, 
    reason, 
    blocked_until, 
    permanent,
    attempts_count
  ) VALUES (
    p_ip_address,
    p_reason,
    CASE 
      WHEN p_permanent THEN NULL
      WHEN p_duration_seconds IS NOT NULL THEN NOW() + (p_duration_seconds || ' seconds')::INTERVAL
      ELSE NOW() + INTERVAL '15 minutes'
    END,
    p_permanent,
    1
  )
  ON CONFLICT (ip_address) DO UPDATE SET
    attempts_count = blocked_ips.attempts_count + 1,
    blocked_until = CASE 
      WHEN p_permanent THEN NULL
      WHEN p_duration_seconds IS NOT NULL THEN NOW() + (p_duration_seconds || ' seconds')::INTERVAL
      ELSE NOW() + INTERVAL '15 minutes'
    END,
    permanent = p_permanent,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Função para desbloquear IP
CREATE OR REPLACE FUNCTION unblock_ip(p_ip_address INET)
RETURNS VOID AS $$
BEGIN
  DELETE FROM blocked_ips WHERE ip_address = p_ip_address;
END;
$$ LANGUAGE plpgsql;

-- Função para registrar tentativa de login
CREATE OR REPLACE FUNCTION log_login_attempt(
  p_ip_address INET,
  p_email TEXT,
  p_success BOOLEAN,
  p_user_agent TEXT DEFAULT NULL,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO login_attempts (
    ip_address,
    email,
    success,
    user_agent,
    failure_reason
  ) VALUES (
    p_ip_address,
    p_email,
    p_success,
    p_user_agent,
    p_failure_reason
  );
  
  -- Se falhou, verificar se deve bloquear IP
  IF NOT p_success THEN
    DECLARE
      attempt_count INTEGER;
      max_attempts INTEGER;
      block_duration INTEGER;
    BEGIN
      -- Buscar configurações
      SELECT setting_value::INTEGER INTO max_attempts
      FROM security_settings 
      WHERE setting_key = 'MAX_LOGIN_ATTEMPTS';
      
      SELECT setting_value::INTEGER INTO block_duration
      FROM security_settings 
      WHERE setting_key = 'LOGIN_BLOCK_DURATION';
      
      -- Contar tentativas nas últimas 15 minutos
      SELECT COUNT(*) INTO attempt_count
      FROM login_attempts
      WHERE ip_address = p_ip_address
        AND success = false
        AND created_at > NOW() - INTERVAL '15 minutes';
      
      -- Bloquear se excedeu tentativas
      IF attempt_count >= COALESCE(max_attempts, 5) THEN
        PERFORM block_ip(
          p_ip_address,
          'Excesso de tentativas de login falhadas',
          COALESCE(block_duration, 900),
          false
        );
      END IF;
    END;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para obter configuração de segurança
CREATE OR REPLACE FUNCTION get_security_setting(p_key TEXT)
RETURNS TEXT AS $$
DECLARE
  setting_value TEXT;
BEGIN
  SELECT s.setting_value INTO setting_value
  FROM security_settings s
  WHERE s.setting_key = p_key AND s.is_active = true;
  
  RETURN setting_value;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. TRIGGERS DE SEGURANÇA
-- =====================================================

-- Trigger para updated_at nas tabelas de segurança
CREATE TRIGGER set_updated_at_blocked_ips
  BEFORE UPDATE ON blocked_ips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_security_settings
  BEFORE UPDATE ON security_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. VIEWS DE SEGURANÇA
-- =====================================================

-- View para relatório de segurança
CREATE OR REPLACE VIEW security_dashboard AS
SELECT 
  -- Tentativas de login nas últimas 24h
  (SELECT COUNT(*) FROM login_attempts WHERE created_at > NOW() - INTERVAL '24 hours') as login_attempts_24h,
  (SELECT COUNT(*) FROM login_attempts WHERE created_at > NOW() - INTERVAL '24 hours' AND success = false) as failed_logins_24h,
  
  -- IPs bloqueados
  (SELECT COUNT(*) FROM blocked_ips WHERE permanent = true OR blocked_until > NOW()) as blocked_ips_count,
  
  -- Logs de segurança nas últimas 24h
  (SELECT COUNT(*) FROM security_logs WHERE created_at > NOW() - INTERVAL '24 hours') as security_incidents_24h,
  (SELECT COUNT(*) FROM security_logs WHERE created_at > NOW() - INTERVAL '24 hours' AND severity IN ('HIGH', 'CRITICAL')) as critical_incidents_24h,
  
  -- Usuários ativos nas últimas 24h
  (SELECT COUNT(DISTINCT user_id) FROM audit_logs WHERE created_at > NOW() - INTERVAL '24 hours') as active_users_24h;

-- View para IPs suspeitos
CREATE OR REPLACE VIEW suspicious_ips AS
SELECT 
  ip_address,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE success = false) as failed_attempts,
  MAX(created_at) as last_attempt,
  array_agg(DISTINCT email) FILTER (WHERE email IS NOT NULL) as attempted_emails
FROM login_attempts
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY ip_address
HAVING COUNT(*) FILTER (WHERE success = false) >= 3
ORDER BY failed_attempts DESC, total_attempts DESC;

-- =====================================================
-- 9. LIMPEZA AUTOMÁTICA DE LOGS ANTIGOS
-- =====================================================

-- Função para limpar logs antigos
CREATE OR REPLACE FUNCTION cleanup_old_security_logs()
RETURNS VOID AS $$
BEGIN
  -- Manter apenas 90 dias de logs de segurança
  DELETE FROM security_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Manter apenas 30 dias de tentativas de login
  DELETE FROM login_attempts 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Remover IPs bloqueados temporariamente que já expiraram
  DELETE FROM blocked_ips 
  WHERE permanent = false 
    AND blocked_until IS NOT NULL 
    AND blocked_until < NOW();
    
  RAISE NOTICE 'Limpeza de logs de segurança concluída';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE security_logs IS 'Logs de eventos de segurança e tentativas de ataque';
COMMENT ON TABLE login_attempts IS 'Histórico de tentativas de login (sucesso e falha)';
COMMENT ON TABLE blocked_ips IS 'IPs bloqueados por atividade suspeita';
COMMENT ON TABLE security_settings IS 'Configurações de segurança do sistema';

COMMENT ON FUNCTION is_ip_blocked(INET) IS 'Verifica se um IP está bloqueado';
COMMENT ON FUNCTION block_ip(INET, TEXT, INTEGER, BOOLEAN) IS 'Bloqueia um IP por atividade suspeita';
COMMENT ON FUNCTION log_login_attempt(INET, TEXT, BOOLEAN, TEXT, TEXT) IS 'Registra tentativa de login e aplica regras de bloqueio';

-- =====================================================
-- 11. VERIFICAÇÃO FINAL
-- =====================================================

\echo ''
\echo '========================================='
\echo 'Migration 06 - Segurança Avançada'
\echo '========================================='
\echo ''
\echo 'Tabelas de segurança criadas:'
SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
AND tablename IN ('security_logs', 'login_attempts', 'blocked_ips', 'security_settings');

\echo ''
\echo 'Configurações de segurança inseridas:'
SELECT COUNT(*) as total FROM security_settings;

\echo ''
\echo 'Funções de segurança criadas:'
SELECT proname FROM pg_proc WHERE proname IN (
  'is_ip_blocked', 'block_ip', 'unblock_ip', 
  'log_login_attempt', 'get_security_setting', 
  'cleanup_old_security_logs'
);

\echo ''
\echo '✅ Migration de segurança concluída com sucesso!'
\echo ''
\echo 'Para executar limpeza automática, execute:'
\echo 'SELECT cleanup_old_security_logs();'
\echo ''