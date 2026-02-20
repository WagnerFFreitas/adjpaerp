# Migração para PostgreSQL Local - ADJPA ERP

## 📋 Pré-requisitos

1. PostgreSQL 14+ instalado
2. Acesso administrativo ao sistema
3. Backup dos dados do Supabase (se aplicável)

## 🚀 Passos de Instalação

### Windows

1. **Instalar PostgreSQL**
   - Baixar: https://www.postgresql.org/download/windows/
   - Ou via Chocolatey: `choco install postgresql`
   - Durante instalação, definir senha do usuário `postgres`
   - Porta padrão: 5432

2. **Executar scripts**
   ```cmd
   cd migration
   psql -U postgres -f 01_create_database.sql
   psql -U postgres -d adjpa_erp -f 02_create_schema.sql
   psql -U postgres -d adjpa_erp -f 03_create_functions.sql
   psql -U postgres -d adjpa_erp -f 04_insert_initial_data.sql
   ```

### Linux (Ubuntu/Debian)

1. **Instalar PostgreSQL**
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. **Executar scripts**
   ```bash
   cd migration
   sudo -u postgres psql -f 01_create_database.sql
   sudo -u postgres psql -d adjpa_erp -f 02_create_schema.sql
   sudo -u postgres psql -d adjpa_erp -f 03_create_functions.sql
   sudo -u postgres psql -d adjpa_erp -f 04_insert_initial_data.sql
   ```

### macOS

1. **Instalar PostgreSQL**
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Executar scripts**
   ```bash
   cd migration
   psql -U postgres -f 01_create_database.sql
   psql -U postgres -d adjpa_erp -f 02_create_schema.sql
   psql -U postgres -d adjpa_erp -f 03_create_functions.sql
   psql -U postgres -d adjpa_erp -f 04_insert_initial_data.sql
   ```

## 🔧 Configuração

Após executar os scripts, configure o arquivo `.env`:

```env
DATABASE_URL=postgresql://adjpa_user:SenhaSeg123!@localhost:5432/adjpa_erp
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adjpa_erp
DB_USER=adjpa_user
DB_PASSWORD=SenhaSeg123!
```

## ✅ Verificação

Execute o script de verificação:
```bash
psql -U adjpa_user -d adjpa_erp -f 05_verify_installation.sql
```

## 📊 Próximos Passos

1. Configurar backup automático (ver `backup/setup_backup.sh`)
2. Configurar acesso em rede (ver `config/postgresql.conf.example`)
3. Atualizar aplicação frontend (ver `frontend/update_config.md`)
