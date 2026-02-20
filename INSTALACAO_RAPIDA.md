# 🚀 Instalação Rápida - ADJPA ERP PostgreSQL Local

## ⚡ Guia Rápido (15 minutos)

### Passo 1: Instalar PostgreSQL

**Windows:**
```cmd
# Baixar e instalar
https://www.postgresql.org/download/windows/

# Durante instalação:
# - Porta: 5432
# - Senha do postgres: [anote esta senha]
# - Locale: Portuguese, Brazil
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Passo 2: Executar Migrations

**Windows:**
```cmd
cd migration
psql -U postgres -f 01_create_database.sql
psql -U postgres -d adjpa_erp -f 02_create_schema.sql
psql -U postgres -d adjpa_erp -f 03_create_functions.sql
psql -U postgres -d adjpa_erp -f 04_insert_initial_data.sql
psql -U postgres -d adjpa_erp -f 05_verify_installation.sql
```

**Linux/macOS:**
```bash
cd migration
sudo -u postgres psql -f 01_create_database.sql
sudo -u postgres psql -d adjpa_erp -f 02_create_schema.sql
sudo -u postgres psql -d adjpa_erp -f 03_create_functions.sql
sudo -u postgres psql -d adjpa_erp -f 04_insert_initial_data.sql
sudo -u postgres psql -d adjpa_erp -f 05_verify_installation.sql
```

### Passo 3: Configurar Acesso em Rede (Opcional)

**Se quiser acessar de outros computadores:**

1. Editar `postgresql.conf`:
   ```conf
   listen_addresses = '*'
   ```

2. Editar `pg_hba.conf`:
   ```conf
   host    all    all    192.168.0.0/16    md5
   ```

3. Reiniciar PostgreSQL:
   ```bash
   # Windows
   net stop postgresql-x64-14
   net start postgresql-x64-14
   
   # Linux
   sudo systemctl restart postgresql
   
   # macOS
   brew services restart postgresql@14
   ```

4. Configurar firewall:
   ```bash
   # Windows
   netsh advfirewall firewall add rule name="PostgreSQL" dir=in action=allow protocol=TCP localport=5432
   
   # Linux
   sudo ufw allow 5432/tcp
   ```

### Passo 4: Configurar Backup Automático

**Windows:**
```cmd
# Editar backup/backup_daily.bat e ajustar caminhos
# Agendar no Task Scheduler:
# - Abrir Task Scheduler
# - Criar Tarefa Básica
# - Nome: Backup ADJPA
# - Gatilho: Diariamente às 2:00
# - Ação: Iniciar programa
# - Programa: C:\caminho\para\backup_daily.bat
```

**Linux:**
```bash
# Dar permissão de execução
chmod +x backup/backup_daily.sh

# Agendar no crontab
crontab -e

# Adicionar linha (backup às 2h da manhã)
0 2 * * * /caminho/para/backup/backup_daily.sh
```

### Passo 5: Testar Conexão

```bash
# Conectar ao banco
psql -U adjpa_user -d adjpa_erp

# Testar queries
SELECT * FROM units;
SELECT * FROM users;
SELECT * FROM profiles;

# Sair
\q
```

## ✅ Credenciais Padrão

### Desenvolvedor (Acesso Total)
```
Email: desenvolvedor@adjpa.com
Senha: dev@ecclesia_secure_2024
```

**Acesso exclusivo a:**
- Configurações fiscais (INSS, IRRF, FGTS)
- Certificados digitais
- Acesso ao banco de dados
- Logs de auditoria
- Estatísticas do sistema

### Administrador Inicial
```
Email: admin@adjpa.com
Senha: admin123
```

**⚠️ IMPORTANTE: Altere a senha após o primeiro login!**

Ver detalhes completos em: [CREDENCIAIS.md](CREDENCIAIS.md)

## 🔧 Configuração do Frontend

### Opção 1: Usar PostgREST (Recomendado)

```bash
# Instalar PostgREST
# Windows: baixar de https://github.com/PostgREST/postgrest/releases
# Linux: sudo apt install postgrest
# macOS: brew install postgrest

# Criar arquivo postgrest.conf
cat > postgrest.conf << EOF
db-uri = "postgres://adjpa_user:SenhaSeg123!@localhost:5432/adjpa_erp"
db-schema = "public"
db-anon-role = "adjpa_user"
server-host = "*"
server-port = 3000
jwt-secret = "sua_chave_secreta_aqui"
EOF

# Iniciar PostgREST
postgrest postgrest.conf
```

### Opção 2: Criar API Node.js

```bash
# Criar pasta API
mkdir api
cd api

# Inicializar projeto
npm init -y

# Instalar dependências
npm install express pg cors dotenv bcrypt jsonwebtoken

# Copiar server.js do guia frontend/update_config.md

# Criar .env
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adjpa_erp
DB_USER=adjpa_user
DB_PASSWORD=SenhaSeg123!
JWT_SECRET=sua_chave_secreta_aqui
API_PORT=3001
EOF

# Iniciar API
node server.js
```

### Atualizar Frontend

```bash
# Criar .env.local
cp .env.local.example .env.local

# Editar .env.local
# VITE_API_URL=http://localhost:3000  # PostgREST
# ou
# VITE_API_URL=http://localhost:3001/api  # Node.js API

# Instalar dependências
npm install

# Iniciar frontend
npm run dev
```

## 📊 Verificar Instalação

```sql
-- Conectar ao banco
psql -U adjpa_user -d adjpa_erp

-- Verificar tabelas
\dt

-- Verificar dados iniciais
SELECT * FROM units;
SELECT * FROM users;
SELECT * FROM tax_configurations;

-- Verificar tamanho do banco
SELECT pg_size_pretty(pg_database_size('adjpa_erp'));
```

## 🆘 Problemas Comuns

### Erro: "psql: command not found"

**Solução:** Adicionar PostgreSQL ao PATH

**Windows:**
```cmd
set PATH=%PATH%;C:\Program Files\PostgreSQL\14\bin
```

**Linux/macOS:**
```bash
export PATH=$PATH:/usr/lib/postgresql/14/bin
```

### Erro: "password authentication failed"

**Solução:** Verificar senha no arquivo `.env` ou `pg_hba.conf`

### Erro: "could not connect to server"

**Solução:** Verificar se PostgreSQL está rodando

```bash
# Windows
net start postgresql-x64-14

# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql@14
```

### Erro: "permission denied"

**Solução:** Executar como administrador/sudo

## 📚 Próximos Passos

1. ✅ Fazer login no sistema
2. ✅ Alterar senha do administrador
3. ✅ Configurar dados da igreja
4. ✅ Criar usuários adicionais
5. ✅ Importar dados existentes (se houver)
6. ✅ Configurar backup automático
7. ✅ Testar em outros computadores da rede

## 📞 Suporte

- Documentação completa: `lista.md`
- Configuração de rede: `config/`
- Scripts de backup: `backup/`
- Atualização frontend: `frontend/update_config.md`

---

**Tempo estimado de instalação:** 15-30 minutos
**Dificuldade:** Intermediária
**Requisitos:** PostgreSQL 14+, Node.js 18+ (opcional)
