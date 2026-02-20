-- =====================================================
-- ADJPA ERP - CRIAÇÃO DO BANCO DE DADOS
-- =====================================================

-- Criar banco de dados
CREATE DATABASE adjpa_erp
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'pt_BR.UTF-8'
    LC_CTYPE = 'pt_BR.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE adjpa_erp IS 'Sistema de Gestão Ministerial ADJPA';

-- Conectar ao banco
\c adjpa_erp

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Criar usuário da aplicação
DO $
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'adjpa_user') THEN
        CREATE USER adjpa_user WITH PASSWORD 'SenhaSeg123!';
    END IF;
END
$;

-- Conceder permissões
GRANT ALL PRIVILEGES ON DATABASE adjpa_erp TO adjpa_user;
GRANT ALL ON SCHEMA public TO adjpa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO adjpa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO adjpa_user;

-- Configurar search_path
ALTER DATABASE adjpa_erp SET search_path TO public;

\echo 'Banco de dados adjpa_erp criado com sucesso!'
