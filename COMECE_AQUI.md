# 👋 Bem-vindo ao ADJPA ERP!

## 🎉 Sistema Completo de Gestão Eclesiástica

Este é um sistema completo para gestão de igrejas, rodando 100% localmente no seu computador.

---

## ⚡ Início Rápido (3 passos)

### 1️⃣ Instalar

```cmd
INSTALACAO_COMPLETA.bat
```

Aguarde 10-15 minutos. O script irá:
- ✅ Instalar PostgreSQL
- ✅ Criar banco de dados
- ✅ Instalar API
- ✅ Instalar Frontend

### 2️⃣ Iniciar

```cmd
START_SISTEMA.bat
```

Isso abrirá 2 janelas:
- API (Backend)
- Frontend (Interface)

### 3️⃣ Acessar

Abra o navegador em: `http://localhost:8080`

**Desenvolvedor (Acesso Total):**
- Email: `desenvolvedor@adjpa.com`
- Senha: `dev@ecclesia_secure_2024`

**Administrador (Alterar senha):**
- Email: `admin@adjpa.com`
- Senha: `admin123`

---

## 📚 Próximos Passos

### Se você é Desenvolvedor:

1. ✅ Fazer login com credenciais de developer
2. ✅ Ler: [GUIA_DESENVOLVEDOR.md](GUIA_DESENVOLVEDOR.md)
3. ✅ Testar endpoints exclusivos
4. ✅ Verificar configurações fiscais
5. ✅ Fazer backup inicial

### Se você é Administrador:

1. ✅ Fazer login com credenciais de admin
2. ⚠️ **ALTERAR SENHA IMEDIATAMENTE**
3. ✅ Ler: [RESUMO_USUARIOS.md](RESUMO_USUARIOS.md)
4. ✅ Configurar dados da igreja
5. ✅ Criar usuários para equipe

### Se você é da Equipe:

1. ✅ Receber credenciais do administrador
2. ✅ Fazer login
3. ✅ Conhecer o sistema
4. ✅ Começar a usar

---

## 📖 Documentação

### Essencial (Leia primeiro!)

- **[RESUMO_FINAL.md](RESUMO_FINAL.md)** - Resumo executivo completo
- **[CREDENCIAIS.md](CREDENCIAIS.md)** - Todas as credenciais
- **[INDEX.md](INDEX.md)** - Índice de toda documentação

### Instalação

- **[GUIA_INSTALACAO_COMPLETO.md](GUIA_INSTALACAO_COMPLETO.md)** - Guia detalhado
- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - 5 minutos

### Uso

- **[RESUMO_USUARIOS.md](RESUMO_USUARIOS.md)** - Usuários e acessos
- **[GUIA_DESENVOLVEDOR.md](GUIA_DESENVOLVEDOR.md)** - Recursos exclusivos
- **[COMANDOS_UTEIS.md](COMANDOS_UTEIS.md)** - Comandos do dia a dia

---

## 🎯 O que o Sistema Faz?

### Módulos Completos:

- ✅ **Membros** - Cadastro completo (50+ campos)
- ✅ **Funcionários** - RH completo (80+ campos)
- ✅ **Folha de Pagamento** - Cálculo automático de impostos
- ✅ **Financeiro** - Contas, transações, contribuições
- ✅ **Patrimônio** - Controle de bens
- ✅ **Eventos** - Agenda de cultos e eventos
- ✅ **Relatórios** - Diversos relatórios

### Recursos Especiais:

- ✅ Cálculo automático de INSS, IRRF, FGTS
- ✅ Controle de acesso por usuário
- ✅ Auditoria completa de ações
- ✅ Backup automático
- ✅ Funciona em rede local
- ✅ Sem limites de armazenamento
- ✅ Sem mensalidades

---

## 🔐 Segurança

### Usuários e Acessos:

**Developer (Desenvolvedor):**
- Acesso TOTAL ao sistema
- Configurações fiscais
- Certificados digitais
- Acesso ao banco de dados

**Admin (Administrador):**
- Gestão geral do sistema
- Membros, funcionários, financeiro
- Criação de usuários
- Relatórios

**Outros Roles:**
- Secretary (Secretário)
- Treasurer (Tesoureiro)
- HR (Recursos Humanos)
- Pastor, Leader, Member, etc

Ver detalhes: [CREDENCIAIS.md](CREDENCIAIS.md)

---

## 💡 Dicas Importantes

### ⚠️ Segurança:

1. **Altere a senha do admin** após primeiro login
2. **Não compartilhe** credenciais do desenvolvedor
3. **Crie usuários individuais** para cada pessoa
4. **Faça backup regular** do banco de dados

### 🚀 Performance:

1. Use **rede local** para melhor velocidade
2. Configure **backup automático**
3. Revise **logs de auditoria** periodicamente
4. Mantenha **PostgreSQL atualizado**

### 📊 Organização:

1. Configure **dados da igreja** primeiro
2. Crie **usuários para equipe**
3. Defina **processos internos**
4. Treine **equipe** no sistema

---

## 🆘 Precisa de Ajuda?

### Problemas Comuns:

**Sistema não inicia:**
```cmd
# Verificar PostgreSQL
net start postgresql-x64-14

# Verificar API
http://localhost:3001/api/health
```

**Esqueci a senha:**
Ver: [CREDENCIAIS.md](CREDENCIAIS.md) > Recuperação de Senha

**Erro de conexão:**
Ver: [GUIA_INSTALACAO_COMPLETO.md](GUIA_INSTALACAO_COMPLETO.md) > Solução de Problemas

### Documentação:

- **Completa:** [INDEX.md](INDEX.md)
- **API:** [api/README.md](api/README.md)
- **Banco:** [migration/README.md](migration/README.md)

---

## 📊 Especificações Técnicas

### Banco de Dados:
- PostgreSQL 14+
- 17 tabelas
- 400+ campos
- 12 funções SQL
- 15 triggers

### Backend:
- Node.js + Express
- TypeScript
- JWT Authentication
- 50+ endpoints

### Frontend:
- React + TypeScript
- Tailwind CSS
- shadcn/ui

### Segurança:
- JWT tokens
- bcrypt passwords
- Rate limiting
- CORS
- Helmet

---

## ✅ Checklist Inicial

### Instalação:
- [ ] PostgreSQL instalado
- [ ] Banco de dados criado
- [ ] API instalada
- [ ] Frontend instalado

### Configuração:
- [ ] Sistema iniciado
- [ ] Login testado
- [ ] Senha do admin alterada
- [ ] Dados da igreja configurados

### Uso:
- [ ] Usuários criados
- [ ] Equipe treinada
- [ ] Backup configurado
- [ ] Sistema em produção

---

## 🎉 Pronto para Começar!

### Passo 1: Instalar
```cmd
INSTALACAO_COMPLETA.bat
```

### Passo 2: Iniciar
```cmd
START_SISTEMA.bat
```

### Passo 3: Acessar
```
http://localhost:8080
```

### Passo 4: Login
```
desenvolvedor@adjpa.com / dev@ecclesia_secure_2024
ou
admin@adjpa.com / admin123
```

---

## 📞 Recursos Adicionais

### Documentação:
- [INDEX.md](INDEX.md) - Índice completo
- [RESUMO_FINAL.md](RESUMO_FINAL.md) - Resumo executivo
- [GUIA_INSTALACAO_COMPLETO.md](GUIA_INSTALACAO_COMPLETO.md) - Instalação

### Scripts:
- `INSTALACAO_COMPLETA.bat` - Instalar tudo
- `START_SISTEMA.bat` - Iniciar sistema
- `START_API.bat` - Apenas API
- `START_FRONTEND.bat` - Apenas Frontend

### Suporte:
- PostgreSQL: https://www.postgresql.org/docs/
- Node.js: https://nodejs.org/docs/
- React: https://react.dev/

---

## 🌟 Características Principais

- ✅ **100% Local** - Sem dependência de internet
- ✅ **Sem Limites** - Armazenamento ilimitado
- ✅ **Sem Mensalidades** - Custo zero de operação
- ✅ **Seguro** - Dados sob seu controle
- ✅ **Rápido** - Performance máxima em rede local
- ✅ **Completo** - Todos os módulos incluídos
- ✅ **Documentado** - Documentação completa
- ✅ **Expansível** - Fácil adicionar recursos

---

**Desenvolvido para:** Assembleia de Deus Jesus Pão que Alimenta  
**Versão:** 1.0.0  
**Data:** Fevereiro 2026  
**Status:** ✅ Pronto para uso

---

## 🚀 Vamos Começar!

Execute agora:
```cmd
INSTALACAO_COMPLETA.bat
```

**Boa sorte e bom trabalho! 🎉**
