# 👨‍💻 Guia do Desenvolvedor - ADJPA ERP

## 🔐 Credenciais de Desenvolvedor

**Email:** `desenvolvedor@adjpa.com`  
**Senha:** `dev@ecclesia_secure_2024`

## 🎯 Acesso Exclusivo

Como desenvolvedor, você tem acesso a recursos críticos que outros usuários (incluindo admins) não têm:

### 1. Configurações Fiscais

Gerenciar tabelas de impostos do governo (INSS, IRRF, FGTS, etc).

**Endpoints:**
```
GET    /api/tax-config              # Listar configurações
GET    /api/tax-config/:id          # Buscar configuração
POST   /api/tax-config              # Criar configuração
PUT    /api/tax-config/:id          # Atualizar configuração
DELETE /api/tax-config/:id          # Excluir configuração
PATCH  /api/tax-config/:id/toggle   # Ativar/Desativar
```

**Exemplo - Listar configurações:**
```bash
curl -X GET http://localhost:3001/api/tax-config \
  -H "Authorization: Bearer <seu_token>"
```

**Exemplo - Criar nova configuração:**
```bash
curl -X POST http://localhost:3001/api/tax-config \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "INSS 2025",
    "type": "INSS",
    "brackets": [
      {"limit": 1500.00, "rate": 7.5},
      {"limit": 2800.00, "rate": 9.0},
      {"limit": 4200.00, "rate": 12.0},
      {"limit": 8000.00, "rate": 14.0}
    ],
    "is_active": true,
    "valid_from": "2025-01-01"
  }'
```

### 2. Acesso ao Banco de Dados

**Informações do banco:**
```bash
curl -X GET http://localhost:3001/api/system/database \
  -H "Authorization: Bearer <seu_token>"
```

**Resposta:**
```json
{
  "database": {
    "database_name": "adjpa_erp",
    "size": "50 MB",
    "connections": 5
  },
  "tables": [
    {
      "schemaname": "public",
      "tablename": "members",
      "size": "10 MB",
      "row_count": 1500
    }
  ],
  "pool": {
    "total": 20,
    "idle": 15,
    "waiting": 0
  }
}
```

**Executar query SQL:**
```bash
curl -X POST http://localhost:3001/api/system/query \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "SELECT COUNT(*) as total FROM members WHERE status = $1",
    "params": ["active"]
  }'
```

⚠️ **Cuidado:** Queries perigosas (DROP, TRUNCATE, DELETE FROM users) são bloqueadas.

### 3. Logs de Auditoria

Visualizar todas as ações realizadas no sistema:

```bash
curl -X GET "http://localhost:3001/api/system/audit-logs?page=1&limit=50" \
  -H "Authorization: Bearer <seu_token>"
```

**Filtros disponíveis:**
- `user_id` - Filtrar por usuário
- `action` - Filtrar por ação (INSERT, UPDATE, DELETE)
- `table_name` - Filtrar por tabela
- `start_date` - Data inicial
- `end_date` - Data final

**Exemplo com filtros:**
```bash
curl -X GET "http://localhost:3001/api/system/audit-logs?action=DELETE&table_name=members&start_date=2024-01-01" \
  -H "Authorization: Bearer <seu_token>"
```

### 4. Estatísticas do Sistema

```bash
curl -X GET http://localhost:3001/api/system/stats \
  -H "Authorization: Bearer <seu_token>"
```

**Resposta:**
```json
{
  "stats": {
    "total_users": 25,
    "total_members": 1500,
    "total_employees": 50,
    "total_transactions": 5000,
    "total_events": 200,
    "total_units": 5,
    "total_audit_logs": 10000,
    "active_sessions": 8
  },
  "recentActivity": [
    {
      "action": "INSERT",
      "table_name": "members",
      "count": 15
    }
  ]
}
```

### 5. Backup do Banco de Dados

```bash
curl -X POST http://localhost:3001/api/system/backup \
  -H "Authorization: Bearer <seu_token>"
```

**Resposta:**
```json
{
  "message": "Para criar backup, execute o comando abaixo no terminal:",
  "commands": {
    "windows": "pg_dump -U adjpa_user -F c -b -v -f backup_%date:~-4,4%%date:~-7,2%%date:~-10,2%.backup adjpa_erp",
    "linux": "pg_dump -U adjpa_user -F c -b -v -f backup_$(date +%Y%m%d).backup adjpa_erp"
  }
}
```

## 🛠️ Tarefas Comuns

### Atualizar Tabela de INSS

1. Desativar configuração antiga:
```bash
curl -X PATCH http://localhost:3001/api/tax-config/<id>/toggle \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

2. Criar nova configuração:
```bash
curl -X POST http://localhost:3001/api/tax-config \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "INSS 2025",
    "type": "INSS",
    "brackets": [...],
    "is_active": true,
    "valid_from": "2025-01-01"
  }'
```

### Verificar Integridade do Banco

```bash
curl -X POST http://localhost:3001/api/system/query \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size FROM pg_tables WHERE schemaname = '\''public'\'' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC"
  }'
```

### Limpar Sessões Expiradas

```bash
curl -X POST http://localhost:3001/api/system/query \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "DELETE FROM user_sessions WHERE expires_at < NOW()"
  }'
```

### Verificar Usuários Ativos

```bash
curl -X POST http://localhost:3001/api/system/query \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sql": "SELECT u.email, p.name, array_agg(ur.role) as roles FROM users u LEFT JOIN profiles p ON p.user_id = u.id LEFT JOIN user_roles ur ON ur.user_id = u.id GROUP BY u.id, u.email, p.name"
  }'
```

## 🔒 Segurança

### Proteções Implementadas:

1. **Autenticação obrigatória** - Todos os endpoints requerem token JWT
2. **Role verificado** - Apenas role "developer" tem acesso
3. **Queries perigosas bloqueadas** - DROP, TRUNCATE, etc são impedidas
4. **Auditoria automática** - Todas as ações são registradas
5. **Rate limiting** - Proteção contra abuso

### Boas Práticas:

1. **Não compartilhe as credenciais** - São exclusivas do desenvolvedor
2. **Use com cuidado** - Você tem acesso total ao sistema
3. **Teste em desenvolvimento** - Antes de executar em produção
4. **Faça backup** - Antes de alterações críticas
5. **Revise logs** - Monitore atividades suspeitas

## 📊 Monitoramento

### Verificar Saúde do Sistema

```bash
# Health check da API
curl http://localhost:3001/api/health

# Estatísticas
curl -X GET http://localhost:3001/api/system/stats \
  -H "Authorization: Bearer <token>"

# Info do banco
curl -X GET http://localhost:3001/api/system/database \
  -H "Authorization: Bearer <token>"
```

### Logs em Tempo Real

```bash
# Últimos 100 logs
curl -X GET "http://localhost:3001/api/system/audit-logs?limit=100" \
  -H "Authorization: Bearer <token>"

# Logs das últimas 24h
curl -X GET "http://localhost:3001/api/system/audit-logs?start_date=$(date -d '1 day ago' +%Y-%m-%d)" \
  -H "Authorization: Bearer <token>"
```

## 🚀 Desenvolvimento

### Adicionar Novo Endpoint Restrito

1. Criar controller em `api/src/controllers/`
2. Criar rota em `api/src/routes/`
3. Aplicar middleware `requireDeveloper`:

```typescript
import { requireDeveloper } from '../middleware/developerAuth';

router.use(authenticateToken);
router.use(requireDeveloper);

router.get('/meu-endpoint', meuController);
```

### Adicionar Nova Configuração Fiscal

1. Criar entrada na tabela `tax_configurations`
2. Definir tipo (INSS, IRRF, FGTS, etc)
3. Configurar brackets (faixas) ou rate (taxa fixa)
4. Definir data de validade

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs: `api/src/system/audit-logs`
2. Verificar documentação: `api/README.md`
3. Verificar código fonte: `api/src/`

---

**Mantenha este guia em local seguro!**
