#!/bin/bash
# =====================================================
# ADJPA ERP - Configurar Permissões dos Scripts
# =====================================================

echo "Configurando permissões dos scripts..."

# Scripts de instalação
chmod +x install_linux.sh
chmod +x install_windows.bat

# Scripts de backup
chmod +x backup/backup_daily.sh
chmod +x backup/restore.sh

# Scripts de migração (não precisam ser executáveis, são usados com psql)
# mas vamos dar permissão de leitura para todos
chmod 644 migration/*.sql

# Arquivos de configuração
chmod 644 config/*.example

# Documentação
chmod 644 *.md
chmod 644 frontend/*.md
chmod 644 migration/README.md

echo "✓ Permissões configuradas!"
echo ""
echo "Scripts executáveis:"
echo "  - install_linux.sh"
echo "  - backup/backup_daily.sh"
echo "  - backup/restore.sh"
echo ""
echo "Para executar a instalação:"
echo "  sudo ./install_linux.sh"
