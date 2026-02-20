#!/bin/bash
# =====================================================
# ADJPA ERP - Instalação Automática (Linux)
# =====================================================

set -e  # Parar em caso de erro

echo ""
echo "====================================================="
echo "  ADJPA ERP - Instalação Automática PostgreSQL"
echo "====================================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "ERRO: Execute este script como root (sudo)"
    exit 1
fi

# Detectar distribuição
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "ERRO: Não foi possível detectar a distribuição"
    exit 1
fi

# Instalar PostgreSQL se necessário
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL não encontrado. Instalando..."
    
    case $OS in
        ubuntu|debian)
            apt update
            apt install -y postgresql postgresql-contrib
            ;;
        fedora|rhel|centos)
            dnf install -y postgresql-server postgresql-contrib
            postgresql-setup --initdb
            ;;
        *)
            echo "Distribuição não suportada: $OS"
            echo "Por favor, instale o PostgreSQL manualmente"
            exit 1
            ;;
    esac
    
    echo "[OK] PostgreSQL instalado"
else
    echo "[OK] PostgreSQL já instalado"
fi

# Iniciar PostgreSQL
echo ""
echo "Iniciando PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql
echo "[OK] PostgreSQL iniciado"

# Diretório de migrations
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MIGRATION_DIR="$SCRIPT_DIR/migration"

# Executar migrations
echo ""
echo "====================================================="
echo "Executando migrations..."
echo "====================================================="
echo ""

echo "[1/5] Criando banco de dados..."
sudo -u postgres psql -f "$MIGRATION_DIR/01_create_database.sql"
echo "[OK] Banco criado"
echo ""

echo "[2/5] Criando schema..."
sudo -u postgres psql -d adjpa_erp -f "$MIGRATION_DIR/02_create_schema.sql"
echo "[OK] Schema criado"
echo ""

echo "[3/5] Criando funções e triggers..."
sudo -u postgres psql -d adjpa_erp -f "$MIGRATION_DIR/03_create_functions.sql"
echo "[OK] Funções criadas"
echo ""

echo "[4/5] Inserindo dados iniciais..."
sudo -u postgres psql -d adjpa_erp -f "$MIGRATION_DIR/04_insert_initial_data.sql"
echo "[OK] Dados inseridos"
echo ""

echo "[5/5] Verificando instalação..."
sudo -u postgres psql -d adjpa_erp -f "$MIGRATION_DIR/05_verify_installation.sql"
echo ""

# Configurar firewall
echo "====================================================="
echo "Configurando firewall..."
echo "====================================================="
echo ""

if command -v ufw &> /dev/null; then
    ufw allow 5432/tcp
    echo "[OK] Regra UFW adicionada"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=5432/tcp
    firewall-cmd --reload
    echo "[OK] Regra firewalld adicionada"
else
    echo "[AVISO] Firewall não detectado. Configure manualmente se necessário"
fi
echo ""

# Configurar backup
echo "====================================================="
echo "Configurando backup..."
echo "====================================================="
echo ""

BACKUP_SCRIPT="$SCRIPT_DIR/backup/backup_daily.sh"
if [ -f "$BACKUP_SCRIPT" ]; then
    chmod +x "$BACKUP_SCRIPT"
    echo "[OK] Script de backup configurado"
    echo ""
    echo "Para agendar backup automático:"
    echo "  sudo crontab -e"
    echo ""
    echo "Adicione a linha:"
    echo "  0 2 * * * $BACKUP_SCRIPT"
    echo ""
else
    echo "[AVISO] Script de backup não encontrado"
fi

# Resumo
echo "====================================================="
echo "INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "====================================================="
echo ""
echo "Credenciais de acesso:"
echo "  Email: admin@adjpa.com"
echo "  Senha: Admin@123"
echo ""
echo "IMPORTANTE:"
echo "  1. Altere a senha após o primeiro login"
echo "  2. Configure os dados da sua igreja"
echo "  3. Agende o backup automático"
echo ""
echo "Próximos passos:"
echo "  1. Configurar API (ver frontend/update_config.md)"
echo "  2. Atualizar frontend"
echo "  3. Testar conexão"
echo ""
echo "Documentação completa: lista.md"
echo "Instalação rápida: INSTALACAO_RAPIDA.md"
echo ""
