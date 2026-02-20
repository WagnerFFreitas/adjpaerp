#!/bin/bash
# =====================================================
# ADJPA ERP - Script de Restauração (Linux/macOS)
# =====================================================

if [ -z "$1" ]; then
    echo "Uso: ./restore.sh caminho_do_backup.sql.gz"
    echo "Exemplo: ./restore.sh /var/backups/adjpa/adjpa_erp_20240216_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"
DB_NAME="adjpa_erp"
DB_USER="adjpa_user"

# Verificar se arquivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERRO: Arquivo de backup não encontrado: $BACKUP_FILE"
    exit 1
fi

echo "====================================================="
echo "RESTAURAÇÃO DO BANCO DE DADOS"
echo "====================================================="
echo ""
echo "Arquivo: $BACKUP_FILE"
echo "Banco: $DB_NAME"
echo ""
echo "ATENÇÃO: Esta operação irá SOBRESCREVER todos os dados!"
echo ""
read -p "Deseja continuar? (s/N): " CONFIRM

if [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ]; then
    echo "Operação cancelada."
    exit 0
fi

echo ""
echo "Desconectando usuários..."
sudo -u postgres psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DB_NAME' AND pid <> pg_backend_pid();"

echo "Removendo banco existente..."
sudo -u postgres dropdb --if-exists $DB_NAME

echo "Criando novo banco..."
sudo -u postgres createdb $DB_NAME

echo "Restaurando backup..."
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | sudo -u postgres psql -d $DB_NAME
else
    sudo -u postgres pg_restore -d $DB_NAME -v "$BACKUP_FILE"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "====================================================="
    echo "Restauração concluída com sucesso!"
    echo "====================================================="
else
    echo ""
    echo "====================================================="
    echo "ERRO na restauração!"
    echo "====================================================="
    exit 1
fi

exit 0
