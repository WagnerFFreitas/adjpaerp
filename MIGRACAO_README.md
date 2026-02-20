# 🗄️ Migração para PostgreSQL Local - ADJPA ERP

## 📁 Estrutura de Arquivos

```
.
├── migration/                      # Scripts de migração do banco
│   ├── README.md                   # Instruções detalhadas
│   ├── 01_create_database.sql      # Criação do banco e usuário
│   ├── 02_create_schema.sql        # Criação de todas as tabelas
│   ├── 03_create_functions.sql     # Funções e triggers
│   ├── 04_insert_initial_data.sql  # Dados iniciais
│   └── 05_verify_installation.sql  # Verificação da instalação
│
├── config/                         # Arquivos de configuração
│   ├── postgresql.conf.example     # Configuração do PostgreSQL
│   └── pg_hba.conf.example         # Configuração de autenticação
│
├── backup/                         # Scripts de backup
│   ├── backup_daily.sh             # Backup diário (Linux/macOS)
│   ├── backup_daily.bat            # Backup diário (Windows)
│   ├── restore.sh                  # Restauração (Linux/macOS)
│   └── restore.bat                 # Restauração (Windows)
│
├── frontend/                       # Configuração do frontend
│   └── update_config.md            # Guia de atualização
│
├── lista.md                        # Documentação completa do sistema
├── INSTALACAO_RAPIDA.md            # Guia de instalação rápida
├── install_linux.sh                # Instalador automático Linux
├── install_windows.bat             # Instalador automático Windows
└── .env.local.example              # Exemplo de variáveis de ambiente
```

## 🚀 Instalação Rápida

### Opção 1: Instalação Automática

**Linux/macOS:**
```bash
chmod +x install_linux.sh
sudo ./install_linux.sh
```

**Windows (como Administrador):**
```cmd
install_windows.bat
```

### Opção 2: Instalação Manual

Siga o guia em `INSTALACAO_RAPIDA.md`

## 📚 Documentação

### Para Iniciantes
- **INSTALACAO_RAPIDA.md** - Guia passo a passo simplificado (15 min)

### Para Administradores
- **lista.md** - Documentação completa do sistema
  - Todos os módulos e recursos
  - Estrutura completa do banco de dados
  - Protocolo de migração detalhado
  - Configuração para múltiplos computadores
  - Segurança e boas práticas

### Para Desenvolvedores
- **frontend/update_config.md** - Atualização do frontend
  - Opções de API (Express vs PostgREST)
  - Configuração do cliente
  - Exemplos de código

## 🗄️ Estrutura do Banco de Dados

### 17 Tabelas Principais

1. **units** - Unidades/Congregações
2. **users** - Usuários do sistema
3. **profiles** - Perfis de usuário
4. **user_roles** - Papéis e permissões
5. **audit_logs** - Logs de auditoria
6. **members** - Membros da igreja (50+ campos)
7. **employees** - Funcionários (80+ campos)
8. **dependents** - Dependentes de funcionários
9. **payrolls** - Folha de pagamento (50+ campos)
10. **employee_leaves** - Afastamentos
11. **assets** - Patrimônio
12. **financial_accounts** - Contas financeiras
13. **transactions** - Transações financeiras
14. **member_contributions** - Contribuições
15. **events** - Eventos da igreja
16. **tax_configurations** - Configurações fiscais
17. **user_sessions** - Sessões de usuário

### Total de Campos: 400+

## ✨ Recursos Implementados

### Autenticação e Segurança
- ✅ Sistema de login com hash de senha (bcrypt)
- ✅ Tokens JWT para sessões
- ✅ Controle de acesso baseado em papéis (RBAC)
- ✅ Auditoria automática de todas as operações
- ✅ Logs de IP e User Agent

### Gestão de Membros
- ✅ Cadastro completo (50+ campos)
- ✅ Vida cristã e ministerial
- ✅ Controle de contribuições
- ✅ Histórico de atividades

### Recursos Humanos
- ✅ Cadastro de funcionários (80+ campos)
- ✅ Dependentes
- ✅ Folha de pagamento automática
- ✅ Cálculo de impostos (INSS, IRRF, FGTS)
- ✅ Afastamentos e férias
- ✅ Benefícios (VT, VA, VR, plano de saúde)

### Financeiro
- ✅ Contas a pagar e receber
- ✅ Fluxo de caixa
- ✅ Múltiplas contas bancárias
- ✅ Parcelamento
- ✅ Conciliação bancária
- ✅ Categorização de despesas

### Patrimônio
- ✅ Cadastro de bens
- ✅ Controle de depreciação
- ✅ Localização e responsável
- ✅ Fotos dos bens

### Eventos
- ✅ Agenda de cultos e eventos
- ✅ Eventos recorrentes
- ✅ Controle de capacidade
- ✅ Recursos necessários

## 🔧 Requisitos

### Mínimos
- PostgreSQL 14+
- 4GB RAM
- 10GB espaço em disco
- Windows 10/11, Linux (Ubuntu 20.04+), ou macOS 11+

### Recomendados
- PostgreSQL 15+
- 8GB RAM
- 50GB SSD
- Rede local 100 Mbps+

## 🌐 Configuração Multi-Computador

### Servidor Principal
1. Instalar PostgreSQL
2. Configurar IP estático
3. Executar migrations
4. Configurar firewall
5. Configurar backup automático

### Clientes (Outros PCs)
1. Configurar `.env.local` com IP do servidor
2. Instalar e configurar frontend
3. Testar conexão

Ver detalhes em `lista.md` seção "Configuração para Uso Local Multi-Computador"

## 💾 Backup e Recuperação

### Backup Automático

**Linux/macOS:**
```bash
# Agendar no crontab
crontab -e

# Adicionar linha (backup às 2h)
0 2 * * * /caminho/para/backup/backup_daily.sh
```

**Windows:**
```
1. Abrir Agendador de Tarefas
2. Criar Tarefa Básica
3. Nome: Backup ADJPA
4. Gatilho: Diariamente às 2:00
5. Ação: backup/backup_daily.bat
```

### Restauração

**Linux/macOS:**
```bash
./backup/restore.sh /caminho/para/backup.sql.gz
```

**Windows:**
```cmd
backup\restore.bat C:\caminho\para\backup.sql
```

## 🔐 Segurança

### Credenciais Padrão
```
Email: admin@adjpa.com
Senha: Admin@123
```

**⚠️ IMPORTANTE: Altere imediatamente após o primeiro login!**

### Boas Práticas
1. ✅ Usar senhas fortes
2. ✅ Habilitar SSL/TLS em produção
3. ✅ Configurar firewall
4. ✅ Fazer backup regular
5. ✅ Manter PostgreSQL atualizado
6. ✅ Revisar logs de auditoria
7. ✅ Limitar acesso à rede

## 📊 Estimativa de Armazenamento

### Igreja Pequena (até 500 membros)
- 5 anos de dados: ~150 MB
- Com backups: ~500 MB

### Igreja Média (500-2000 membros)
- 5 anos de dados: ~500 MB
- Com backups: ~2 GB

### Igreja Grande (2000+ membros)
- 5 anos de dados: ~2 GB
- Com backups: ~10 GB

## 🆘 Suporte

### Problemas Comuns

**Erro de conexão:**
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql  # Linux
net start postgresql-x64-14       # Windows
```

**Erro de autenticação:**
```bash
# Verificar configuração
cat /etc/postgresql/14/main/pg_hba.conf  # Linux
```

**Erro de permissão:**
```bash
# Executar como administrador/sudo
sudo ./install_linux.sh  # Linux
# Ou clicar com botão direito > Executar como administrador (Windows)
```

### Documentação Adicional
- PostgreSQL: https://www.postgresql.org/docs/
- Guia completo: `lista.md`
- Instalação rápida: `INSTALACAO_RAPIDA.md`

## 📝 Checklist de Migração

- [ ] Instalar PostgreSQL
- [ ] Executar migrations
- [ ] Verificar instalação
- [ ] Configurar firewall (se rede)
- [ ] Configurar backup automático
- [ ] Testar backup e restauração
- [ ] Configurar API (Express ou PostgREST)
- [ ] Atualizar frontend
- [ ] Testar login
- [ ] Testar operações CRUD
- [ ] Importar dados existentes (se houver)
- [ ] Alterar senha padrão
- [ ] Criar usuários adicionais
- [ ] Configurar dados da igreja
- [ ] Treinar usuários
- [ ] Documentar configuração

## 🎯 Próximos Passos

1. ✅ Executar instalação
2. ✅ Verificar funcionamento
3. ✅ Configurar backup
4. ✅ Atualizar frontend
5. ✅ Treinar equipe
6. ✅ Importar dados (se houver)
7. ✅ Começar a usar!

## 📞 Contato

Para suporte técnico ou dúvidas:
- Documentação: `lista.md`
- Issues: [criar issue no repositório]
- Email: [seu-email@exemplo.com]

---

**Versão:** 1.0.0  
**Data:** 16 de Fevereiro de 2026  
**Licença:** Uso interno ADJPA  
**Desenvolvido para:** Assembleia de Deus Jesus Pão que Alimenta
