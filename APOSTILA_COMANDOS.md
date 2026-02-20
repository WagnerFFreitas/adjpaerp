# 📘 Apostila de Comandos - ADJPA ERP

Este documento reúne todos os comandos essenciais para instalação, execução, manutenção e gestão do banco de dados do sistema ADJPA ERP.

---

## 🚀 1. Instalação e Configuração

### Scripts Automáticos (Windows)
Estes scripts executam toda a configuração inicial.

```batch
:: Instalação completa (Banco + API + Frontend)
INSTALACAO_COMPLETA.bat

:: Apenas criação do banco de dados
criabd.bat

:: Instalação via script Windows (alternativo)
install_windows.bat
```

### Instalação Manual (Terminal)
Caso precise instalar passo a passo.

**Backend (API):**
```bash
cd api
npm install                 # Instalar dependências
copy .env.example .env      # Criar arquivo de configuração
```

**Frontend (Interface):**
```bash
cd ..                       # Voltar para raiz se estiver na api
npm install                 # Instalar dependências
copy .env.example .env.local # Criar configuração (se houver exemplo)
```

---

## ▶️ 2. Execução do Sistema

### Atalho Rápido
```batch
:: Inicia API e Frontend simultaneamente
START_SISTEMA.bat
```

### Execução Manual (Desenvolvimento)
Requer dois terminais abertos.

**Terminal 1 (API):**
```bash
cd api
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### Execução Manual (Produção)

**API:**
```bash
cd api
npm run build       # Compilar TypeScript para JS
npm run start:prod  # Iniciar versão otimizada
```

**Frontend:**
```bash
npm run build       # Gerar arquivos estáticos na pasta dist/
npm run preview     # Visualizar a build localmente
```

---

## 🐘 3. Banco de Dados (PostgreSQL)

### Conexão via Terminal
```bash
:: Conectar com usuário padrão do sistema
psql -U adjpa_user -d adjpa_erp

:: Conectar como superusuário (postgres)
psql -U postgres
```

### Comandos de Backup e Restauração
```bash
:: Criar Backup (Dump)
pg_dump -U adjpa_user -d adjpa_erp -F c -f backup.sql

:: Restaurar Backup
pg_restore -U adjpa_user -d adjpa_erp -v backup.sql

:: Backup apenas dos dados (sem estrutura)
pg_dump -U adjpa_user -d adjpa_erp --data-only -f dados.sql
```

### Comandos SQL Úteis (Dentro do psql)

**Verificações Básicas:**
```sql
\dt                         -- Listar todas as tabelas
\d members                  -- Ver estrutura da tabela de membros
SELECT pg_size_pretty(pg_database_size('adjpa_erp')); -- Ver tamanho do banco
```

**Consultas de Manutenção:**
```sql
-- Limpeza e otimização
VACUUM ANALYZE;

-- Reindexar (caso o banco esteja lento)
REINDEX DATABASE adjpa_erp;

-- Ver conexões ativas
SELECT pid, usename, state, query FROM pg_stat_activity WHERE datname = 'adjpa_erp';
```

**Reset de Senha de Admin (Emergência):**
```sql
UPDATE users 
SET password_hash = '$2b$10$SeuHashAqui...' 
WHERE email = 'admin@adjpa.com';
```

---

## 🧪 4. Testes e Verificação

### Scripts de Teste Automatizados (PowerShell)
```powershell
:: Testar fluxo de login completo
.\TESTE_LOGIN_COMPLETO.ps1

:: Testar disponibilidade do Frontend
.\TESTE_FRONTEND.ps1

:: Testar formulário de membros
.\TESTE_MEMBROS_FORM.ps1

:: Testar upload de arquivos
.\TESTE_UPLOAD_COMPLETO.ps1
```

### Testes via CURL (API)

**Login de Desenvolvedor:**
```bash
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"desenvolvedor@adjpa.com\", \"password\": \"dev@ecclesia_secure_2024\"}"
```

**Verificar Saúde do Sistema:**
```bash
curl http://localhost:3001/api/system/health
```

---

## 🛠️ 5. Manutenção do Servidor

### Gerenciamento de Processos (PM2)
Para manter a API rodando em segundo plano (Produção).

```bash
npm install -g pm2          # Instalar PM2 globalmente
cd api
npm run build
pm2 start dist/server.js --name adjpa-api  # Iniciar serviço
pm2 save                    # Salvar lista de processos
pm2 startup                 # Configurar para iniciar com o Windows/Linux
pm2 list                    # Listar processos
pm2 logs adjpa-api          # Ver logs
```

### Serviços do Windows (PostgreSQL)
Caso o banco não conecte.

```cmd
:: Parar serviço
net stop postgresql-x64-14

:: Iniciar serviço
net start postgresql-x64-14
```

---

## 🌐 6. Configuração de Rede

### Descobrir IP do Servidor
```cmd
ipconfig
```

### Liberar Acesso Externo (PostgreSQL)
Editar arquivos em: `C:\Program Files\PostgreSQL\14\data\`

1. **postgresql.conf**:
   ```conf
   listen_addresses = '*'
   ```

2. **pg_hba.conf**:
   ```conf
   host    all    all    0.0.0.0/0    md5
   ```

---

## 🔑 7. Credenciais Padrão

**Desenvolvedor (Acesso Total):**
- Email: `desenvolvedor@adjpa.com`
- Senha: `dev@ecclesia_secure_2024`

**Administrador:**
- Email: `admin@adjpa.com`
- Senha: `admin123` (ou `Admin@123` dependendo da versão da migration)

---
*Documento gerado automaticamente com base nos arquivos do projeto ADJPA ERP.*