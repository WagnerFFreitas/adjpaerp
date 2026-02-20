# ADJPA ERP API

API REST para o sistema ADJPA ERP com PostgreSQL local.

## 🚀 Instalação

### 1. Instalar Dependências

```bash
cd api
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
```

### 3. Iniciar API

**Desenvolvimento (com hot-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm run start:prod
```

## 📚 Endpoints

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário logado
- `POST /api/auth/change-password` - Alterar senha

### Membros

- `GET /api/members` - Listar membros
- `GET /api/members/:id` - Buscar membro
- `POST /api/members` - Criar membro
- `PUT /api/members/:id` - Atualizar membro
- `DELETE /api/members/:id` - Excluir membro

### Funcionários

- `GET /api/employees` - Listar funcionários
- `GET /api/employees/:id` - Buscar funcionário
- `POST /api/employees` - Criar funcionário
- `PUT /api/employees/:id` - Atualizar funcionário
- `DELETE /api/employees/:id` - Excluir funcionário

### Financeiro

- `GET /api/financial/transactions` - Listar transações
- `GET /api/financial/transactions/:id` - Buscar transação
- `POST /api/financial/transactions` - Criar transação
- `PUT /api/financial/transactions/:id` - Atualizar transação
- `DELETE /api/financial/transactions/:id` - Excluir transação
- `GET /api/financial/accounts` - Listar contas

### Unidades

- `GET /api/units` - Listar unidades
- `GET /api/units/:id` - Buscar unidade
- `POST /api/units` - Criar unidade
- `PUT /api/units/:id` - Atualizar unidade

## 🔐 Autenticação

Todas as rotas (exceto `/api/auth/login`) requerem autenticação via JWT.

**Header:**
```
Authorization: Bearer <token>
```

## 🎭 Roles (Papéis)

- `developer` - **Acesso total** (configurações fiscais, certificados, BD, logs)
- `admin` - Acesso total exceto recursos exclusivos de developer
- `secretary` - Gestão de membros
- `treasurer` - Gestão financeira
- `hr` - Recursos humanos
- `pastor` - Visualização geral
- `leader` - Líder de departamento
- `member` - Membro comum
- `visitor` - Visitante
- `guest` - Convidado

### Recursos Exclusivos do Developer:

**Configurações Fiscais:**
- `GET /api/tax-config` - Listar configurações
- `POST /api/tax-config` - Criar configuração
- `PUT /api/tax-config/:id` - Atualizar
- `DELETE /api/tax-config/:id` - Excluir

**Sistema:**
- `GET /api/system/database` - Info do banco
- `POST /api/system/query` - Executar SQL
- `GET /api/system/audit-logs` - Logs de auditoria
- `GET /api/system/stats` - Estatísticas
- `POST /api/system/backup` - Backup

## 📊 Paginação

Endpoints de listagem suportam paginação:

```
GET /api/members?page=1&limit=50
```

**Resposta:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

## 🔍 Filtros

Endpoints de listagem suportam filtros:

```
GET /api/members?unit_id=xxx&status=active&search=João
```

## ⚠️ Tratamento de Erros

**Formato de erro:**
```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

**Códigos HTTP:**
- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Não encontrado
- `500` - Erro interno

## 🛠️ Desenvolvimento

### Estrutura de Pastas

```
api/
├── src/
│   ├── config/          # Configurações (database)
│   ├── controllers/     # Controladores
│   ├── middleware/      # Middlewares (auth, validator, error)
│   ├── routes/          # Rotas
│   └── server.ts        # Servidor principal
├── .env.example         # Exemplo de variáveis
├── package.json
└── tsconfig.json
```

### Adicionar Novo Endpoint

1. Criar controller em `src/controllers/`
2. Criar rotas em `src/routes/`
3. Registrar rotas em `src/routes/index.ts`

## 📝 Logs

A API registra:
- Requisições HTTP (morgan)
- Queries SQL (com duração)
- Erros

## 🔒 Segurança

- ✅ Helmet (headers de segurança)
- ✅ CORS configurável
- ✅ Rate limiting
- ✅ JWT com expiração
- ✅ Validação de dados (Joi)
- ✅ Senhas com bcrypt
- ✅ SQL injection protection (prepared statements)

## 🚀 Deploy

### Produção

1. Compilar TypeScript:
```bash
npm run build
```

2. Iniciar:
```bash
npm start
```

### PM2 (Recomendado)

```bash
npm install -g pm2
pm2 start dist/server.js --name adjpa-api
pm2 save
pm2 startup
```

## 📞 Suporte

- Documentação completa: Ver pasta raiz do projeto
- Issues: [repositório]
