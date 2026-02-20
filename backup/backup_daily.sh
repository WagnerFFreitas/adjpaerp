#!/bin/bash
# =====================================================
# ADJPA ERP - Script de Backup Diário
# =====================================================

# Configurações
BACKUP_DIR="/var/backups/adjpa"
DB_NAME="adjpa_erp"
DB_USER="adjpa_user"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/adjpa_erp_$DATE.sql.gz"
LOG_FILE="$BACKUP_DIR/backup.log"

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Função de log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "Iniciando backup do banco de dados..."

# Fazer backup comprimido
pg_dump -U $DB_USER -d $DB_NAME | gzip > $BACKUP_FILE

# Verificar se backup foi criado
if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "Backup criado com sucesso: $BACKUP_FILE ($SIZE)"
    
    # Verificar integridade
    if gunzip -t $BACKUP_FILE 2>/dev/null; then
        log "Integridade do backup verificada: OK"
    else
        log "ERRO: Backup corrompido!"
        exit 1
    fi
else
    log "ERRO: Falha ao criar backup!"
    exit 1
fi

# Manter apenas últimos 30 dias
log "Removendo backups antigos (>30 dias)..."
find $BACKUP_DIR -name "adjpa_erp_*.sql.gz" -mtime +30 -delete
REMOVED=$(find $BACKUP_DIR -name "adjpa_erp_*.sql.gz" -mtime +30 | wc -l)
log "Backups removidos: $REMOVED"

# Estatísticas
TOTAL_BACKUPS=$(ls -1 $BACKUP_DIR/adjpa_erp_*.sql.gz 2>/dev/null | wc -l)
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
log "Total de backups: $TOTAL_BACKUPS"
log "Espaço utilizado: $TOTAL_SIZE"

log "Backup concluído com sucesso!"

# Opcional: Copiar para servidor remoto
# scp $BACKUP_FILE usuario@servidor-backup:/backups/adjpa/

# Opcional: Enviar para nuvem (Google Drive, Dropbox, etc)
# rclone copy $BACKUP_FILE gdrive:backups/adjpa/

exit 0
