# 🔐 Credenciais do Sistema ADJPA ERP

## 👨‍💻 Desenvolvedor (Acesso Total)

**Email:** `desenvolvedor@adjpa.com`  
**Senha:** `dev@ecclesia_secure_2024`

### Permissões:
- ✅ Acesso TOTAL ao sistema
- ✅ Configurações fiscais (INSS, IRRF, FGTS, etc)
- ✅ Instalação de certificados digitais
- ✅ Acesso direto ao banco de dados
- ✅ Execução de queries SQL
- ✅ Visualização de logs de auditoria
- ✅ Estatísticas do sistema
- ✅ Backup do banco de dados
- ✅ Todas as funcionalidades de admin

### Endpoints Exclusivos:

#### Configurações Fiscais
- `GET /api/tax-config` - Listar configurações
- `GET /api/tax-config/:id` - Buscar configuração
- `POST /api/tax-config` - Criar configuração
- `PUT /api/tax-config/:id` - Atualizar configuração
- `DELETE /api/tax-config/:id` - Excluir configuração
- `PATCH /api/tax-config/:id/toggle` - Ativar/Desativar

#### Sistema
- `GET /api/system/database` - Informações do banco
- `POST /api/system/query` - Executar query SQL
- `GET /api/system/audit-logs` - Logs de auditoria
- `GET /api/system/stats` - Estatísticas do sistema
- `POST /api/system/backup` - Instruções de backup

---

## 👤 Administrador Inicial (Alterar após primeiro login)

**Email:** `admin@adjpa.com`  
**Senha:** `admin123`

### Permissões:
- ✅ Gestão de membros
- ✅ Gestão de funcionários
- ✅ Gestão financeira
- ✅ Gestão de patrimônio
- ✅ Gestão de eventos
- ✅ Gestão de unidades
- ✅ Criação de usuários
- ✅ Relatórios
- ❌ Configurações fiscais (apenas desenvolvedor)
- ❌ Acesso ao banco de dados (apenas desenvolvedor)
- ❌ Certificados digitais (apenas desenvolvedor)

### ⚠️ IMPORTANTE:
**Esta senha DEVE ser alterada após o primeiro login!**

Para alterar a senha:
1. Fazer login com as credenciais acima
2. Ir em Perfil > Alterar Senha
3. Ou usar o endpoint: `POST /api/auth/change-password`

---

## 🔒 Segurança

### Boas Práticas:

1. **Desenvolvedor:**
   - Mantenha as credenciais em local seguro
   - Não compartilhe com outros usuários
   - Use apenas quando necessário acessar recursos críticos
   - Considere criar um usuário admin separado para uso diário

2. **Administrador:**
   - Altere a senha imediatamente após primeiro login
   - Use senha forte (mínimo 8 caracteres, letras, números e símbolos)
   - Não compartilhe as credenciais
   - Crie usuários específicos para cada pessoa da equipe

3. **Geral:**
   - Revise logs de auditoria regularmente
   - Desative usuários que não são mais necessários
   - Use roles apropriados para cada usuário
   - Faça backup regular do banco de dados

---

## 📊 Hierarquia de Roles

```
developer (Desenvolvedor)
    ↓ Acesso Total
    ├── Configurações fiscais
    ├── Certificados digitais
    ├── Acesso ao banco de dados
    ├── Logs de auditoria
    └── Todas as funcionalidades abaixo

admin (Administrador)
    ↓ Gestão Geral
    ├── Membros
    ├── Funcionários
    ├── Financeiro
    ├── Patrimônio
    ├── Eventos
    └── Usuários

secretary (Secretário)
    ↓ Gestão de Membros
    └── CRUD de membros

treasurer (Tesoureiro)
    ↓ Gestão Financeira
    └── Transações e contas

hr (Recursos Humanos)
    ↓ Gestão de Funcionários
    └── CRUD de funcionários

pastor (Pastor)
    ↓ Visualização
    └── Acesso de leitura

leader (Líder)
    ↓ Departamento
    └── Gestão do seu departamento

member (Membro)
    ↓ Básico
    └── Visualização limitada

visitor (Visitante)
    ↓ Mínimo
    └── Visualização muito limitada

guest (Convidado)
    ↓ Restrito
    └── Acesso temporário
```

---

## 🔄 Alterar Senha

### Via Interface:
1. Login no sistema
2. Menu > Perfil
3. Alterar Senha
4. Informar senha atual e nova senha

### Via API:
```bash
curl -X POST http://localhost:3001/api/auth/change-password \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "senha_atual",
    "newPassword": "nova_senha_forte"
  }'
```

---

## 📝 Criar Novos Usuários

### Via Interface:
1. Login como admin ou desenvolvedor
2. Menu > Usuários
3. Novo Usuário
4. Preencher dados e selecionar roles

### Via SQL (apenas desenvolvedor):
```sql
-- Conectar ao banco
psql -U adjpa_user -d adjpa_erp

-- Criar usuário
INSERT INTO users (email, password_hash, email_confirmed)
VALUES ('usuario@exemplo.com', hash_password('senha123'), true);

-- Adicionar role
INSERT INTO user_roles (user_id, role, unit_id)
SELECT id, 'secretary', (SELECT id FROM units WHERE is_headquarter = true)
FROM users WHERE email = 'usuario@exemplo.com';
```

---

## ⚠️ Recuperação de Senha

Se esquecer a senha do desenvolvedor ou admin:

```sql
-- Conectar ao banco como postgres
psql -U postgres -d adjpa_erp

-- Resetar senha do desenvolvedor
UPDATE users 
SET password_hash = hash_password('dev@ecclesia_secure_2024')
WHERE email = 'desenvolvedor@adjpa.com';

-- Resetar senha do admin
UPDATE users 
SET password_hash = hash_password('admin123')
WHERE email = 'admin@adjpa.com';
```

---

**Mantenha este arquivo em local seguro e não o compartilhe publicamente!**
