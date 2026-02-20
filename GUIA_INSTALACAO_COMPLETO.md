# 🚀 Guia de Instalação Completo - ADJPA ERP

## 📋 Pré-requisitos

- Windows 10/11 (ou Linux/macOS)
- PostgreSQL 14+ instalado
- Node.js 18+ instalado
- 4GB RAM mínimo
- 10GB espaço em disco

## 🎯 Instalação Passo a Passo

### Passo 1: Instalar PostgreSQL e Criar Banco

Execute o instalador automático:

```cmd
install_windows.bat
```

Isso irá:
- ✅ Verificar PostgreSQL
- ✅ Criar banco de dados `adjpa_erp`
- ✅ Criar usuário `adjpa_user`
- ✅ Executar todas as migrations
- ✅ Inserir dados iniciais
- ✅ Configurar firewall

### Passo 2: Instalar Dependências da API

```cmd
cd api
npm install
```

### Passo 3: Configurar API

```cmd
cd api
copy .env.example .env
```

Edite o arquivo `api/.env` se necessário (as configurações padrão já funcionam).

### Passo 4: Iniciar API

**Desenvolvimento:**
```cmd
cd api
npm run dev
```

**Produção:**
```cmd
cd api
npm run start:prod
```

A API estará rodando em: `http://localhost:3001`

### Passo 5: Instalar Dependências do Frontend

```cmd
npm install
```

### Passo 6: Iniciar Frontend

```cmd
npm run dev
```

O frontend estará rodando em: `http://localhost:8080`

## ✅ Testar Instalação

1. Abra o navegador em `http://localhost:8080`
2. Faça login com uma das credenciais:

**Desenvolvedor (Acesso Total):**
- Email: `desenvolvedor@adjpa.com`
- Senha: `dev@ecclesia_secure_2024`

**Administrador Inicial:**
- Email: `admin@adjpa.com`
- Senha: `admin123`

3. ⚠️ **IMPORTANTE:** Altere a senha do administrador após o primeiro login!

Ver todas as credenciais em: [CREDENCIAIS.md](CREDENCIAIS.md)

## 🌐 Configuração para Rede Local (Múltiplos Computadores)

### No Servidor (Computador Principal)

1. **Descobrir IP do servidor:**
```cmd
ipconfig
```
Anote o IPv4 (ex: 192.168.1.100)

2. **Configurar PostgreSQL para aceitar conexões de rede:**

Edite `C:\Program Files\PostgreSQL\14\data\postgresql.conf`:
```conf
listen_addresses = '*'
```

Edite `C:\Program Files\PostgreSQL\14\data\pg_hba.conf`:
```conf
host    all    all    192.168.0.0/16    md5
```

3. **Reiniciar PostgreSQL:**
```cmd
net stop postgresql-x64-14
net start postgresql-x64-14
```

4. **Iniciar API e Frontend:**
```cmd
# Terminal 1: API
cd api
npm run start:prod

# Terminal 2: Frontend
npm run dev
```

### Nos Clientes (Outros Computadores)

1. **Clonar ou copiar apenas a pasta do projeto**

2. **Configurar `.env.local`:**
```env
VITE_API_URL=http://192.168.1.100:3001/api
```
(Substitua pelo IP do servidor)

3. **Instalar dependências:**
```cmd
npm install
```

4. **Iniciar frontend:**
```cmd
npm run dev
```

## 🔧 Configuração Avançada

### Usar PM2 para Manter API Rodando

```cmd
npm install -g pm2

cd api
npm run build
pm2 start dist/server.js --name adjpa-api
pm2 save
pm2 startup
```

### Configurar Backup Automático

**Windows:**
1. Abrir Agendador de Tarefas
2. Criar Tarefa Básica
3. Nome: "Backup ADJPA"
4. Gatilho: Diariamente às 2:00
5. Ação: Executar `backup\backup_daily.bat`

## 📊 Estrutura de Pastas

```
ADJPA-ERP/
├── api/                    # API Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/        # Configuração do banco
│   │   ├── controllers/   # Lógica de negócio
│   │   ├── middleware/    # Auth, validação, erros
│   │   ├── routes/        # Rotas da API
│   │   └── server.ts      # Servidor principal
│   ├── .env               # Configurações da API
│   └── package.json
│
├── src/                    # Frontend (React + TypeScript)
│   ├── components/
│   ├── pages/
│   ├── lib/
│   │   └── api.ts         # Cliente da API
│   └── contexts/
│
├── migration/              # Scripts SQL
├── backup/                 # Scripts de backup
├── .env.local             # Configurações do frontend
└── install_windows.bat    # Instalador automático
```

## 🆘 Solução de Problemas

### API não inicia

**Erro: "Cannot connect to database"**
```cmd
# Verificar se PostgreSQL está rodando
net start postgresql-x64-14

# Testar conexão
psql -U adjpa_user -d adjpa_erp
```

**Erro: "Port 3001 already in use"**
```cmd
# Alterar porta no api/.env
PORT=3002
```

### Frontend não conecta na API

**Erro: "Network Error"**
1. Verificar se API está rodando: `http://localhost:3001/api/health`
2. Verificar `.env.local` tem a URL correta
3. Verificar firewall não está bloqueando

### Erro de autenticação

**Erro: "Token inválido"**
1. Limpar localStorage do navegador
2. Fazer login novamente
3. Verificar se JWT_SECRET é o mesmo na API

## 📝 Comandos Úteis

### API
```cmd
cd api
npm run dev          # Desenvolvimento
npm run build        # Compilar
npm start            # Produção
```

### Frontend
```cmd
npm run dev          # Desenvolvimento
npm run build        # Compilar para produção
npm run preview      # Preview da build
```

### Banco de Dados
```cmd
# Conectar ao banco
psql -U adjpa_user -d adjpa_erp

# Backup manual
pg_dump -U adjpa_user adjpa_erp > backup.sql

# Restaurar backup
psql -U adjpa_user -d adjpa_erp < backup.sql
```

## 🎉 Pronto!

Seu sistema ADJPA ERP está instalado e funcionando!

### Próximos Passos:

1. ✅ Alterar senha do administrador
2. ✅ Configurar dados da igreja
3. ✅ Criar usuários adicionais
4. ✅ Configurar backup automático
5. ✅ Testar em outros computadores (se necessário)
6. ✅ Importar dados existentes (se houver)

## 📞 Suporte

- Documentação da API: `api/README.md`
- Documentação completa: `lista.md`
- Instalação rápida: `INSTALACAO_RAPIDA.md`
- Comandos úteis: `COMANDOS_UTEIS.md`

---

**Desenvolvido para:** Assembleia de Deus Jesus Pão que Alimenta  
**Versão:** 1.0.0  
**Data:** Fevereiro 2026
