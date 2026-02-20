# 🛠️ Comandos Úteis - ADJPA ERP PostgreSQL

## 🔌 Conexão ao Banco

### Conectar localmente
```bash
psql -U adjpa_user -d adjpa_erp
```

### Conectar remotamente
```bash
psql -h 192.168.1.100 -U adjpa_user -d adjpa_erp
```

### Conectar como postgres (admin)
```bash
# Linux/macOS
sudo -u postgres psql

# Windows
psql -U postgres
```

## 📊 Consultas Básicas

### Ver todas as tabelas
```sql
\dt
```

### Descrever estrutura de uma tabela
```sql
\d members
\d+ members  -- com mais detalhes
```

### Ver tamanho do banco
```sql
SELECT pg_size_pretty(pg_database_size('adjpa_erp'));
```

### Ver tamanho de cada tabela
```sql
SELECT 
  schemaname || '.' || tablename as table_name,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  pg_total_relation_size(schemaname||'.'||tablename) as bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY bytes DESC;
```

### Contar registros de todas as tabelas
```sql
SELECT 'members' as tabela, COUNT(*) as registros FROM members
UNION ALL
SELECT 'employees', COUNT(*) FROM employees
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'payrolls', COUNT(*) FROM payrolls
ORDER BY registros DESC;
```

## 👥 Gestão de Usuários

### Criar novo usuário
```sql
INSERT INTO users (email, password_hash, email_confirmed)
VALUES ('usuario@adjpa.com', hash_password('senha123'), true);
```

### Adicionar papel a usuário
```sql
-- Buscar ID do usuário
SELECT id, email FROM users WHERE email = 'usuario@adjpa.com';

-- Adicionar papel
INSERT INTO user_roles (user_id, role, unit_id)
VALUES ('uuid-do-usuario', 'secretary', 'uuid-da-unidade');
```

### Listar usuários e seus papéis
```sql
SELECT 
  u.email,
  p.name,
  array_agg(ur.role) as roles
FROM users u
JOIN profiles p ON p.user_id = u.id
LEFT JOIN user_roles ur ON ur.user_id = u.id
GROUP BY u.email, p.name;
```

### Alterar senha de usuário
```sql
UPDATE users 
SET password_hash = hash_password('nova_senha')
WHERE email = 'usuario@adjpa.com';
```

### Desativar usuário (remover todos os papéis)
```sql
DELETE FROM user_roles WHERE user_id = 'uuid-do-usuario';
```

## 🏢 Gestão de Unidades

### Listar unidades
```sql
SELECT * FROM units ORDER BY name;
```

### Criar nova unidade
```sql
INSERT INTO units (name, city, state, is_headquarter)
VALUES ('Congregação Centro', 'São Paulo', 'SP', false);
```

### Atualizar dados da unidade
```sql
UPDATE units 
SET 
  cnpj = '12.345.678/0001-90',
  address = 'Rua Principal, 123',
  phone = '(11) 1234-5678',
  email = 'contato@adjpa.com'
WHERE name = 'AD Jesus Pão que Alimenta - Sede';
```

## 👤 Gestão de Membros

### Buscar membro por nome
```sql
SELECT id, name, email, phone, status
FROM members
WHERE name ILIKE '%joão%'
ORDER BY name;
```

### Buscar membro por CPF
```sql
SELECT * FROM members WHERE cpf = '123.456.789-00';
```

### Listar membros ativos
```sql
SELECT name, email, phone, membership_date
FROM members
WHERE status = 'ACTIVE'
ORDER BY name;
```

### Membros por ministério
```sql
SELECT 
  main_ministry,
  COUNT(*) as total
FROM members
WHERE status = 'ACTIVE'
GROUP BY main_ministry
ORDER BY total DESC;
```

### Aniversariantes do mês
```sql
SELECT 
  name,
  birth_date,
  EXTRACT(DAY FROM birth_date) as dia,
  phone
FROM members
WHERE EXTRACT(MONTH FROM birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
  AND status = 'ACTIVE'
ORDER BY EXTRACT(DAY FROM birth_date);
```

## 💼 Gestão de Funcionários

### Listar funcionários ativos
```sql
SELECT 
  matricula,
  name,
  position,
  admission_date,
  base_salary
FROM employees
WHERE status = 'ACTIVE'
ORDER BY name;
```

### Funcionários com dependentes
```sql
SELECT 
  e.name as funcionario,
  e.dependents_count,
  COUNT(d.id) as dependentes_cadastrados
FROM employees e
LEFT JOIN dependents d ON d.employee_id = e.id
WHERE e.status = 'ACTIVE'
GROUP BY e.id, e.name, e.dependents_count
HAVING e.dependents_count > 0;
```

### Funcionários por departamento
```sql
SELECT 
  department,
  COUNT(*) as total,
  SUM(base_salary) as folha_total
FROM employees
WHERE status = 'ACTIVE'
GROUP BY department
ORDER BY total DESC;
```

## 💰 Gestão Financeira

### Saldo de todas as contas
```sql
SELECT 
  name,
  type,
  pg_size_pretty(current_balance::numeric) as saldo,
  is_active
FROM financial_accounts
ORDER BY current_balance DESC;
```

### Transações do mês
```sql
SELECT 
  date,
  description,
  type,
  amount,
  payment_method,
  status
FROM transactions
WHERE date >= date_trunc('month', CURRENT_DATE)
  AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
ORDER BY date DESC;
```

### Receitas vs Despesas do mês
```sql
SELECT 
  type,
  COUNT(*) as quantidade,
  SUM(amount) as total
FROM transactions
WHERE date >= date_trunc('month', CURRENT_DATE)
  AND status = 'PAID'
GROUP BY type;
```

### Maiores despesas do ano
```sql
SELECT 
  description,
  amount,
  date,
  category
FROM transactions
WHERE type = 'EXPENSE'
  AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
  AND status = 'PAID'
ORDER BY amount DESC
LIMIT 10;
```

### Contribuições por membro
```sql
SELECT 
  m.name,
  COUNT(mc.id) as total_contribuicoes,
  SUM(mc.amount) as total_valor
FROM members m
JOIN member_contributions mc ON mc.member_id = m.id
WHERE EXTRACT(YEAR FROM mc.date) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY m.id, m.name
ORDER BY total_valor DESC
LIMIT 20;
```

## 📅 Gestão de Eventos

### Próximos eventos
```sql
SELECT 
  title,
  date,
  time,
  location,
  type,
  attendees_count
FROM events
WHERE date >= CURRENT_DATE
ORDER BY date, time
LIMIT 10;
```

### Eventos do mês
```sql
SELECT 
  title,
  date,
  time,
  type,
  attendees_count
FROM events
WHERE date >= date_trunc('month', CURRENT_DATE)
  AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
ORDER BY date, time;
```

## 📋 Folha de Pagamento

### Folha do mês atual
```sql
SELECT 
  e.name,
  p.base_salary,
  p.total_earnings,
  p.total_deductions,
  p.net_salary,
  p.status
FROM payrolls p
JOIN employees e ON e.id = p.employee_id
WHERE p.month = EXTRACT(MONTH FROM CURRENT_DATE)
  AND p.year = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY e.name;
```

### Total da folha por mês
```sql
SELECT 
  year,
  month,
  COUNT(*) as funcionarios,
  SUM(base_salary) as salarios,
  SUM(total_earnings) as proventos,
  SUM(total_deductions) as descontos,
  SUM(net_salary) as liquido,
  SUM(inss_employer + fgts_employer + rat) as encargos
FROM payrolls
GROUP BY year, month
ORDER BY year DESC, month DESC;
```

## 🔍 Auditoria

### Últimas ações no sistema
```sql
SELECT 
  created_at,
  user_name,
  action,
  entity,
  entity_id
FROM audit_logs
ORDER BY created_at DESC
LIMIT 50;
```

### Ações de um usuário específico
```sql
SELECT 
  created_at,
  action,
  entity,
  entity_id,
  ip_address
FROM audit_logs
WHERE user_name = 'Administrador'
ORDER BY created_at DESC
LIMIT 100;
```

### Alterações em uma entidade específica
```sql
SELECT 
  created_at,
  user_name,
  action,
  old_data,
  new_data
FROM audit_logs
WHERE entity = 'members'
  AND entity_id = 'uuid-do-membro'
ORDER BY created_at DESC;
```

## 🔧 Manutenção

### Vacuum e analyze (limpeza)
```sql
VACUUM ANALYZE;
```

### Reindexar banco
```sql
REINDEX DATABASE adjpa_erp;
```

### Ver conexões ativas
```sql
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  LEFT(query, 50) as query
FROM pg_stat_activity
WHERE datname = 'adjpa_erp';
```

### Matar conexão travada
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'adjpa_erp'
  AND pid <> pg_backend_pid()
  AND state = 'idle in transaction'
  AND query_start < NOW() - INTERVAL '10 minutes';
```

### Ver queries lentas
```sql
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Ver índices não utilizados
```sql
SELECT 
  schemaname || '.' || tablename as table_name,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size,
  idx_scan as scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

## 💾 Backup e Restauração

### Backup completo
```bash
pg_dump -U adjpa_user -d adjpa_erp -F c -f backup.sql
```

### Backup comprimido
```bash
pg_dump -U adjpa_user -d adjpa_erp | gzip > backup.sql.gz
```

### Backup apenas schema
```bash
pg_dump -U adjpa_user -d adjpa_erp --schema-only -f schema.sql
```

### Backup apenas dados
```bash
pg_dump -U adjpa_user -d adjpa_erp --data-only -f data.sql
```

### Restaurar backup
```bash
pg_restore -U adjpa_user -d adjpa_erp -v backup.sql
```

### Restaurar backup comprimido
```bash
gunzip -c backup.sql.gz | psql -U adjpa_user -d adjpa_erp
```

## 🚨 Emergência

### Resetar senha do admin
```sql
UPDATE users 
SET password_hash = hash_password('Admin@123')
WHERE email = 'admin@adjpa.com';
```

### Remover todas as sessões
```sql
DELETE FROM user_sessions;
```

### Verificar integridade do banco
```bash
pg_dump -U adjpa_user -d adjpa_erp --schema-only | psql -U adjpa_user -d adjpa_erp_test
```

## 📊 Relatórios Úteis

### Dashboard resumo
```sql
SELECT 
  'Membros Ativos' as metrica,
  COUNT(*)::text as valor
FROM members WHERE status = 'ACTIVE'
UNION ALL
SELECT 'Funcionários Ativos', COUNT(*)::text
FROM employees WHERE status = 'ACTIVE'
UNION ALL
SELECT 'Saldo Total', pg_size_pretty(SUM(current_balance)::numeric)
FROM financial_accounts WHERE is_active = true
UNION ALL
SELECT 'Eventos Este Mês', COUNT(*)::text
FROM events 
WHERE date >= date_trunc('month', CURRENT_DATE)
  AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month';
```

---

**Dica:** Salve seus comandos mais usados em um arquivo `.sql` para reutilização!
