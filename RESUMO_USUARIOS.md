# 👥 Resumo de Usuários - ADJPA ERP

## 🔐 Usuários Criados

### 1. Desenvolvedor (Super Admin)

**Email:** `desenvolvedor@adjpa.com`  
**Senha:** `dev@ecclesia_secure_2024`  
**Role:** `developer`

**Acesso Exclusivo:**
- ✅ Configurações fiscais (INSS, IRRF, FGTS, RAT, etc)
- ✅ Instalação de certificados digitais
- ✅ Acesso direto ao banco de dados
- ✅ Execução de queries SQL
- ✅ Logs de auditoria completos
- ✅ Estatísticas do sistema
- ✅ Backup do banco de dados
- ✅ Todas as funcionalidades de admin

**Quando usar:**
- Atualizar tabelas de impostos do governo
- Instalar certificados digitais para NF-e
- Fazer manutenção no banco de dados
- Investigar problemas técnicos
- Executar queries complexas
- Revisar logs de auditoria

**Segurança:**
- Mantenha as credenciais em local seguro
- Não compartilhe com outros usuários
- Use apenas quando necessário
- Considere criar um admin separado para uso diário

---

### 2. Administrador Inicial

**Email:** `admin@adjpa.com`  
**Senha:** `admin123`  
**Role:** `admin`

**Acesso:**
- ✅ Gestão de membros
- ✅ Gestão de funcionários
- ✅ Gestão financeira
- ✅ Gestão de patrimônio
- ✅ Gestão de eventos
- ✅ Gestão de unidades
- ✅ Criação de usuários
- ✅ Relatórios
- ❌ Configurações fiscais (apenas developer)
- ❌ Acesso ao banco de dados (apenas developer)

**⚠️ IMPORTANTE:**
Esta senha **DEVE** ser alterada após o primeiro login!

**Quando usar:**
- Gestão diária do sistema
- Cadastro de membros e funcionários
- Gestão financeira
- Criação de novos usuários
- Configuração da igreja

**Próximos passos:**
1. Fazer login
2. Alterar senha imediatamente
3. Configurar dados da igreja
4. Criar usuários para a equipe

---

## 📊 Comparação de Acesso

| Recurso | Developer | Admin | Outros |
|---------|-----------|-------|--------|
| Membros | ✅ | ✅ | Limitado |
| Funcionários | ✅ | ✅ | Limitado |
| Financeiro | ✅ | ✅ | Limitado |
| Patrimônio | ✅ | ✅ | Limitado |
| Eventos | ✅ | ✅ | Limitado |
| Usuários | ✅ | ✅ | ❌ |
| **Configurações Fiscais** | ✅ | ❌ | ❌ |
| **Certificados Digitais** | ✅ | ❌ | ❌ |
| **Acesso ao BD** | ✅ | ❌ | ❌ |
| **Logs de Auditoria** | ✅ | ❌ | ❌ |
| **Queries SQL** | ✅ | ❌ | ❌ |

---

## 🔄 Fluxo de Trabalho Recomendado

### Primeiro Acesso (Desenvolvedor)

1. Login como desenvolvedor
2. Verificar instalação do banco
3. Revisar configurações fiscais
4. Verificar logs de auditoria
5. Criar backup inicial

### Primeiro Acesso (Administrador)

1. Login como admin
2. **Alterar senha imediatamente**
3. Configurar dados da igreja
4. Criar usuários para a equipe:
   - Secretário (secretary)
   - Tesoureiro (treasurer)
   - RH (hr)
   - Pastor (pastor)
5. Importar dados existentes (se houver)

### Uso Diário

**Desenvolvedor:**
- Usar apenas para tarefas técnicas
- Atualizar configurações fiscais quando necessário
- Revisar logs periodicamente
- Fazer backups regulares

**Administrador:**
- Gestão diária do sistema
- Supervisionar equipe
- Revisar relatórios
- Aprovar operações importantes

**Equipe:**
- Cada pessoa com seu próprio usuário
- Roles apropriados para suas funções
- Não compartilhar credenciais

---

## 🔒 Segurança

### Boas Práticas:

1. **Senhas Fortes:**
   - Mínimo 8 caracteres
   - Letras maiúsculas e minúsculas
   - Números e símbolos
   - Não usar palavras comuns

2. **Não Compartilhar:**
   - Cada pessoa deve ter seu próprio usuário
   - Não compartilhar credenciais
   - Desativar usuários que saíram

3. **Revisar Regularmente:**
   - Logs de auditoria
   - Usuários ativos
   - Permissões concedidas

4. **Backup:**
   - Fazer backup regular
   - Testar restauração
   - Manter backups em local seguro

---

## 📝 Criar Novos Usuários

### Via Interface (Recomendado):

1. Login como admin ou developer
2. Menu > Usuários
3. Novo Usuário
4. Preencher:
   - Nome
   - Email
   - Username
   - Senha inicial
   - Roles
   - Unidade padrão
5. Salvar

### Via SQL (Apenas Developer):

```sql
-- Conectar ao banco
psql -U adjpa_user -d adjpa_erp

-- Criar usuário
INSERT INTO users (email, password_hash, email_confirmed)
VALUES ('secretaria@adjpa.com', hash_password('senha123'), true);

-- Adicionar role
INSERT INTO user_roles (user_id, role, unit_id)
SELECT 
  u.id, 
  'secretary', 
  (SELECT id FROM units WHERE is_headquarter = true)
FROM users u 
WHERE u.email = 'secretaria@adjpa.com';
```

---

## 🆘 Recuperação de Acesso

### Esqueci a senha do desenvolvedor:

```sql
-- Conectar como postgres
psql -U postgres -d adjpa_erp

-- Resetar senha
UPDATE users 
SET password_hash = hash_password('dev@ecclesia_secure_2024')
WHERE email = 'desenvolvedor@adjpa.com';
```

### Esqueci a senha do admin:

```sql
-- Conectar como postgres
psql -U postgres -d adjpa_erp

-- Resetar senha
UPDATE users 
SET password_hash = hash_password('admin123')
WHERE email = 'admin@adjpa.com';
```

---

## 📚 Documentação Relacionada

- **[CREDENCIAIS.md](CREDENCIAIS.md)** - Todas as credenciais e detalhes
- **[GUIA_DESENVOLVEDOR.md](GUIA_DESENVOLVEDOR.md)** - Recursos exclusivos do developer
- **[GUIA_INSTALACAO_COMPLETO.md](GUIA_INSTALACAO_COMPLETO.md)** - Instalação completa
- **[README.md](README.md)** - Visão geral do sistema

---

**Mantenha este arquivo em local seguro!**
