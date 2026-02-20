-- =====================================================
-- ADJPA ERP - Expansão de Membros (Dados Eclesiásticos)
-- Migration 05
-- =====================================================

\c adjpa_erp

-- =====================================================
-- 1. ADICIONAR CAMPOS ECLESIÁSTICOS À TABELA MEMBERS
-- =====================================================

-- Dados de Conversão
ALTER TABLE members ADD COLUMN IF NOT EXISTS conversion_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS conversion_place VARCHAR(255);

-- Dados de Batismo
ALTER TABLE members ADD COLUMN IF NOT EXISTS baptism_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS baptism_church VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS baptism_pastor VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS holy_spirit_baptism BOOLEAN DEFAULT FALSE;

-- Dados de Membresia
ALTER TABLE members ADD COLUMN IF NOT EXISTS membership_date DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS origin_church VARCHAR(255);

-- Formação Espiritual
ALTER TABLE members ADD COLUMN IF NOT EXISTS discipleship_course BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS bible_school BOOLEAN DEFAULT FALSE;

-- Ministérios e Funções
ALTER TABLE members ADD COLUMN IF NOT EXISTS main_ministry VARCHAR(100);
ALTER TABLE members ADD COLUMN IF NOT EXISTS ministry_function VARCHAR(100);
ALTER TABLE members ADD COLUMN IF NOT EXISTS other_ministries TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS ecclesiastical_position VARCHAR(100);
ALTER TABLE members ADD COLUMN IF NOT EXISTS consecration_date DATE;

-- Contribuições
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_tither BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS is_regular_offerer BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS participates_campaigns BOOLEAN DEFAULT FALSE;

-- Outros Dados
ALTER TABLE members ADD COLUMN IF NOT EXISTS special_needs TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS talents TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS spiritual_gifts TEXT[];
ALTER TABLE members ADD COLUMN IF NOT EXISTS cell_group VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS profession VARCHAR(255);
ALTER TABLE members ADD COLUMN IF NOT EXISTS role_function VARCHAR(100);

-- =====================================================
-- 2. CRIAR TABELA DE MINISTÉRIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES members(id) ON DELETE SET NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ministries_unit ON ministries(unit_id);
CREATE INDEX IF NOT EXISTS idx_ministries_leader ON ministries(leader_id);
CREATE INDEX IF NOT EXISTS idx_ministries_active ON ministries(is_active);

-- =====================================================
-- 3. CRIAR TABELA DE CÉLULAS/GRUPOS
-- =====================================================

CREATE TABLE IF NOT EXISTS cells (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES members(id) ON DELETE SET NULL,
  location VARCHAR(255),
  meeting_day VARCHAR(50),
  meeting_time TIME,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cells_unit ON cells(unit_id);
CREATE INDEX IF NOT EXISTS idx_cells_leader ON cells(leader_id);
CREATE INDEX IF NOT EXISTS idx_cells_active ON cells(is_active);

-- =====================================================
-- 4. CRIAR TABELA DE CONTRIBUIÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- TITHE, OFFERING, CAMPAIGN, MISSION, CONSTRUCTION
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  payment_method VARCHAR(50), -- CASH, CARD, TRANSFER, PIX, CHECK
  reference VARCHAR(255),
  description TEXT,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_contributions_member ON contributions(member_id);
CREATE INDEX IF NOT EXISTS idx_contributions_unit ON contributions(unit_id);
CREATE INDEX IF NOT EXISTS idx_contributions_date ON contributions(date);
CREATE INDEX IF NOT EXISTS idx_contributions_type ON contributions(type);

-- =====================================================
-- 5. CRIAR TABELA DE DONS ESPIRITUAIS (REFERÊNCIA)
-- =====================================================

CREATE TABLE IF NOT EXISTS spiritual_gifts_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  biblical_reference VARCHAR(255),
  category VARCHAR(50), -- MINISTRY, SERVICE, MANIFESTATION
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir dons espirituais comuns
INSERT INTO spiritual_gifts_reference (name, description, category, biblical_reference) VALUES
('Profecia', 'Dom de transmitir mensagens de Deus', 'MANIFESTATION', '1 Coríntios 12:10'),
('Ensino', 'Dom de explicar e aplicar a Palavra de Deus', 'MINISTRY', 'Romanos 12:7'),
('Evangelismo', 'Dom de compartilhar o evangelho', 'MINISTRY', 'Efésios 4:11'),
('Pastor', 'Dom de cuidar e guiar o rebanho', 'MINISTRY', 'Efésios 4:11'),
('Liderança', 'Dom de dirigir e motivar outros', 'SERVICE', 'Romanos 12:8'),
('Administração', 'Dom de organizar e gerenciar', 'SERVICE', '1 Coríntios 12:28'),
('Misericórdia', 'Dom de demonstrar compaixão', 'SERVICE', 'Romanos 12:8'),
('Serviço', 'Dom de ajudar e servir outros', 'SERVICE', 'Romanos 12:7'),
('Contribuição', 'Dom de dar generosamente', 'SERVICE', 'Romanos 12:8'),
('Fé', 'Dom de confiar em Deus extraordinariamente', 'MANIFESTATION', '1 Coríntios 12:9'),
('Cura', 'Dom de curar enfermidades', 'MANIFESTATION', '1 Coríntios 12:9'),
('Milagres', 'Dom de realizar sinais sobrenaturais', 'MANIFESTATION', '1 Coríntios 12:10'),
('Discernimento', 'Dom de distinguir espíritos', 'MANIFESTATION', '1 Coríntios 12:10'),
('Línguas', 'Dom de falar em línguas desconhecidas', 'MANIFESTATION', '1 Coríntios 12:10'),
('Interpretação', 'Dom de interpretar línguas', 'MANIFESTATION', '1 Coríntios 12:10'),
('Sabedoria', 'Dom de aplicar conhecimento divino', 'MANIFESTATION', '1 Coríntios 12:8'),
('Conhecimento', 'Dom de compreender verdades espirituais', 'MANIFESTATION', '1 Coríntios 12:8'),
('Exortação', 'Dom de encorajar e consolar', 'SERVICE', 'Romanos 12:8'),
('Hospitalidade', 'Dom de receber e acolher', 'SERVICE', '1 Pedro 4:9'),
('Intercessão', 'Dom de orar pelos outros', 'SERVICE', 'Romanos 8:26-27')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 6. CRIAR TABELA DE TALENTOS (REFERÊNCIA)
-- =====================================================

CREATE TABLE IF NOT EXISTS talents_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(50), -- MUSIC, ART, TECHNICAL, COMMUNICATION, MANUAL
  created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir talentos comuns
INSERT INTO talents_reference (name, category) VALUES
('Canto', 'MUSIC'),
('Instrumento Musical', 'MUSIC'),
('Regência', 'MUSIC'),
('Composição Musical', 'MUSIC'),
('Desenho', 'ART'),
('Pintura', 'ART'),
('Fotografia', 'ART'),
('Design Gráfico', 'ART'),
('Vídeo/Edição', 'TECHNICAL'),
('Som/Áudio', 'TECHNICAL'),
('Iluminação', 'TECHNICAL'),
('Informática', 'TECHNICAL'),
('Oratória', 'COMMUNICATION'),
('Escrita', 'COMMUNICATION'),
('Teatro/Drama', 'COMMUNICATION'),
('Dança', 'COMMUNICATION'),
('Carpintaria', 'MANUAL'),
('Elétrica', 'MANUAL'),
('Mecânica', 'MANUAL'),
('Costura', 'MANUAL'),
('Culinária', 'MANUAL'),
('Jardinagem', 'MANUAL')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 7. INSERIR MINISTÉRIOS PADRÃO
-- =====================================================

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Louvor e Adoração', 
  'Ministério responsável pela música e adoração nos cultos',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Intercessão', 
  'Ministério de oração e intercessão',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Evangelismo', 
  'Ministério de evangelização e missões',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Ensino', 
  'Ministério de ensino e escola bíblica',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Crianças', 
  'Ministério infantil',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Adolescentes', 
  'Ministério de adolescentes',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Jovens', 
  'Ministério de jovens',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Casais', 
  'Ministério de casais',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Mulheres', 
  'Ministério feminino',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

INSERT INTO ministries (name, description, unit_id, is_active) 
SELECT 
  'Homens', 
  'Ministério masculino',
  id,
  TRUE
FROM units WHERE is_headquarter = TRUE
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. COMENTÁRIOS NAS COLUNAS
-- =====================================================

COMMENT ON COLUMN members.conversion_date IS 'Data de conversão do membro';
COMMENT ON COLUMN members.baptism_date IS 'Data do batismo nas águas';
COMMENT ON COLUMN members.holy_spirit_baptism IS 'Recebeu batismo no Espírito Santo';
COMMENT ON COLUMN members.membership_date IS 'Data de entrada como membro';
COMMENT ON COLUMN members.is_tither IS 'É dizimista regular';
COMMENT ON COLUMN members.spiritual_gifts IS 'Array de dons espirituais';
COMMENT ON COLUMN members.talents IS 'Array de talentos naturais';

COMMENT ON TABLE ministries IS 'Ministérios da igreja';
COMMENT ON TABLE cells IS 'Células ou grupos pequenos';
COMMENT ON TABLE contributions IS 'Histórico de contribuições dos membros';

-- =====================================================
-- 9. VERIFICAÇÃO
-- =====================================================

\echo ''
\echo '========================================='
\echo 'Migration 05 - Membros Eclesiásticos'
\echo '========================================='
\echo ''
\echo 'Tabelas criadas:'
SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
AND tablename IN ('ministries', 'cells', 'contributions', 'spiritual_gifts_reference', 'talents_reference');

\echo ''
\echo 'Ministérios inseridos:'
SELECT COUNT(*) as total FROM ministries;

\echo ''
\echo 'Dons espirituais inseridos:'
SELECT COUNT(*) as total FROM spiritual_gifts_reference;

\echo ''
\echo 'Talentos inseridos:'
SELECT COUNT(*) as total FROM talents_reference;

\echo ''
\echo '✅ Migration concluída com sucesso!'
\echo ''