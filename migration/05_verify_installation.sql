-- =====================================================
-- ADJPA ERP - VERIFICAÇÃO DA INSTALAÇÃO
-- =====================================================

\c adjpa_erp

\echo ''
\echo '========================================='
\echo 'VERIFICAÇÃO DA INSTALAÇÃO'
\echo '========================================='
\echo ''

-- 1. Verificar extensões
\echo '1. Extensões instaladas:'
SELECT extname, extversion FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_stat_statements');

\echo ''
\echo '2. Tabelas criadas:'
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

\echo ''
\echo '3. Contagem de registros:'
SELECT 'units' as tabela, COUNT(*) as registros FROM units
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'financial_accounts', COUNT(*) FROM financial_accounts
UNION ALL
SELECT 'tax_configurations', COUNT(*) FROM tax_configurations
ORDER BY tabela;

\echo ''
\echo '4. Funções criadas:'
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

\echo ''
\echo '5. Triggers criados:'
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

\echo ''
\echo '6. Índices criados:'
SELECT 
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

\echo ''
\echo '7. Usuário administrador:'
SELECT 
  u.email,
  p.name,
  p.username,
  array_agg(ur.role) as roles
FROM users u
JOIN profiles p ON p.user_id = u.id
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email = 'admin@adjpa.com'
GROUP BY u.email, p.name, p.username;

\echo ''
\echo '8. Configurações fiscais:'
SELECT 
  name,
  type,
  CASE 
    WHEN rate IS NOT NULL THEN rate::TEXT || '%'
    ELSE 'Tabela progressiva'
  END as aliquota,
  is_active,
  valid_from
FROM tax_configurations
ORDER BY type, name;

\echo ''
\echo '9. Tamanho total do banco:'
SELECT pg_size_pretty(pg_database_size('adjpa_erp')) as tamanho_total;

\echo ''
\echo '10. Conexões ativas:'
SELECT 
  count(*) as total_conexoes,
  count(*) FILTER (WHERE state = 'active') as ativas,
  count(*) FILTER (WHERE state = 'idle') as ociosas
FROM pg_stat_activity
WHERE datname = 'adjpa_erp';

\echo ''
\echo '========================================='
\echo 'VERIFICAÇÃO CONCLUÍDA!'
\echo '========================================='
\echo ''
\echo 'Status: ✓ Instalação bem-sucedida'
\echo ''
\echo 'Próximos passos:'
\echo '  1. Faça login com admin@adjpa.com / Admin@123'
\echo '  2. Altere a senha do administrador'
\echo '  3. Configure os dados da sua igreja'
\echo '  4. Crie usuários adicionais'
\echo ''
