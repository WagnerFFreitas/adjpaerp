# 🔒 GUIA DE SEGURANÇA DO BANCO DE DADOS - ADJPA ERP

## 📋 Visão Geral

Este documento detalha todas as medidas de segurança implementadas e recomendações adicionais para proteger o banco de dados PostgreSQL contra SQL injection, invasões e outras ameaças.

---

## ✅ MEDIDAS JÁ IMPLEMENTADAS

### 1. **Proteção contra SQL Injection**

#### ✅ **Prepared Statements (Parameterized Queries)**
```typescript
// ✅ CORRETO - Usando parâmetros
const result = await query(`
  SELECT * FROM users WHERE email = $1 AND status = $2
`, [email, status]);

// ❌ INCORRETO - Concatenação direta (vulnerável)
const result = await query(`
  SELECT * FROM users WHERE email = '${email}'
`);
```

#### ✅ **Validação de Entrada com Joi**
```typescript
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
```

### 2. **Autenticação e Autorização**

#### ✅ **JWT com Expiração**
```typescript
const token = jwt.sign(payload, JWT_SECRET, { 
  expiresIn: '7d' 
});
```

#### ✅ **Hash de Senhas com bcrypt**
```sql
-- Função no banco para hash seguro
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf', 12));
END;
$$ LANGUAGE plpgsql;
```

#### ✅ **Controle de Acesso por Roles**
```typescript
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const hasRole = roles.some(role => 
      req.user!.roles.includes(role)
    );
    if (!hasRole) {
      return res.status(403).json({ error: 'Permissão negada' });
    }
    next();
  };
};
```

### 3. **Segurança do Servidor**

#### ✅ **Helmet.js - Headers de Segurança**
```typescript
app.use(helmet()); // Adiciona headers de segurança
```

#### ✅ **Rate Limiting**
```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
```

#### ✅ **CORS Configurado**
```typescript
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(','),
  credentials: true,
};
```

### 4. **Auditoria e Logs**

#### ✅ **Tabela de Auditoria**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🚀 MELHORIAS RECOMENDADAS

### 1. **Segurança Avançada do PostgreSQL**

#### 🔧 **Configurações do postgresql.conf**
```ini
# Conexões
max_connections = 100
listen_addresses = 'localhost'  # Apenas local

# SSL (Recomendado para produção)
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'

# Logs de segurança
log_connections = on
log_disconnections = on
log_statement = 'mod'  # Log INSERT, UPDATE, DELETE
log_min_duration_statement = 1000  # Log queries > 1s

# Timeout
statement_timeout = 30000  # 30 segundos
idle_in_transaction_session_timeout = 60000  # 1 minuto
```

#### 🔧 **Configurações do pg_hba.conf**
```ini
# Apenas conexões locais com senha
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5

# Bloquear conexões remotas (comentar se necessário)
# host    all             all             0.0.0.0/0               reject
```

### 2. **Validação e Sanitização Avançada**

#### 🔧 **Middleware de Sanitização**
```typescript
import validator from 'validator';
import xss from 'xss';

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      // Remove XSS
      obj = xss(obj);
      // Escape caracteres especiais
      obj = validator.escape(obj);
      return obj;
    }
    
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitizeObject(obj[key]);
      }
    }
    
    return obj;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  
  next();
};
```

#### 🔧 **Validação de CPF/CNPJ**
```typescript
import { cpf, cnpj } from 'cpf-cnpj-validator';

const memberSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  cpf: Joi.string().custom((value, helpers) => {
    if (!cpf.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
});
```

### 3. **Criptografia de Dados Sensíveis**

#### 🔧 **Criptografia de Campos Sensíveis**
```sql
-- Instalar extensão de criptografia
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para criptografar dados sensíveis
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(encrypt(data::bytea, 'encryption_key', 'aes'), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Função para descriptografar
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN convert_from(decrypt(decode(encrypted_data, 'base64'), 'encryption_key', 'aes'), 'UTF8');
END;
$$ LANGUAGE plpgsql;
```

#### 🔧 **Criptografar CPF/RG no Banco**
```typescript
// Ao inserir dados sensíveis
const encryptedCPF = await query(
  'SELECT encrypt_sensitive_data($1) as encrypted_cpf',
  [cpf]
);

// Ao buscar dados sensíveis
const decryptedData = await query(`
  SELECT 
    id, name, email,
    decrypt_sensitive_data(cpf) as cpf,
    decrypt_sensitive_data(rg) as rg
  FROM members WHERE id = $1
`, [memberId]);
```

### 4. **Monitoramento e Alertas**

#### 🔧 **Sistema de Detecção de Intrusão**
```typescript
// Middleware para detectar tentativas de SQL injection
export const detectSQLInjection = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\/\*|\*\/|;|'|"|`)/,
    /(\bOR\b|\bAND\b).*(\b=\b|\bLIKE\b)/i,
    /(INFORMATION_SCHEMA|SYSOBJECTS|SYSCOLUMNS)/i
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  const hasSuspiciousContent = 
    checkValue(req.body) || 
    checkValue(req.query) || 
    checkValue(req.params);

  if (hasSuspiciousContent) {
    // Log da tentativa de ataque
    console.error('🚨 TENTATIVA DE SQL INJECTION DETECTADA:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      timestamp: new Date().toISOString()
    });

    // Registrar no banco
    query(`
      INSERT INTO security_logs (
        ip_address, user_agent, attack_type, 
        request_data, created_at
      ) VALUES ($1, $2, $3, $4, NOW())
    `, [
      req.ip,
      req.get('User-Agent'),
      'SQL_INJECTION_ATTEMPT',
      JSON.stringify({ body: req.body, query: req.query, params: req.params })
    ]);

    return res.status(400).json({
      error: 'Requisição bloqueada por motivos de segurança'
    });
  }

  next();
};
```

#### 🔧 **Tabela de Logs de Segurança**
```sql
CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET,
  user_agent TEXT,
  attack_type TEXT,
  request_data JSONB,
  blocked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_security_logs_ip ON security_logs(ip_address);
CREATE INDEX idx_security_logs_type ON security_logs(attack_type);
CREATE INDEX idx_security_logs_date ON security_logs(created_at DESC);
```

### 5. **Backup e Recuperação Segura**

#### 🔧 **Script de Backup Criptografado**
```batch
@echo off
:: backup_seguro.bat

set BACKUP_DIR=C:\ADJPA_Backups
set DATE=%date:~-4,4%%date:~-10,2%%date:~-7,2%
set TIME=%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_FILE=%BACKUP_DIR%\adjpa_backup_%DATE%_%TIME%.sql

:: Criar backup
pg_dump -h localhost -U postgres -d adjpa_erp > %BACKUP_FILE%

:: Criptografar backup
gpg --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 ^
    --s2k-digest-algo SHA512 --s2k-count 65536 ^
    --symmetric --output %BACKUP_FILE%.gpg %BACKUP_FILE%

:: Remover arquivo não criptografado
del %BACKUP_FILE%

echo Backup criptografado criado: %BACKUP_FILE%.gpg
```

### 6. **Configurações de Rede e Firewall**

#### 🔧 **Configuração de Firewall Windows**
```batch
:: Bloquear PostgreSQL para conexões externas
netsh advfirewall firewall add rule name="Block PostgreSQL External" ^
  dir=in action=block protocol=TCP localport=5432 remoteip=!127.0.0.1

:: Permitir apenas aplicação local
netsh advfirewall firewall add rule name="Allow ADJPA API" ^
  dir=in action=allow protocol=TCP localport=3001 remoteip=127.0.0.1
```

### 7. **Monitoramento de Performance e Segurança**

#### 🔧 **Middleware de Monitoramento**
```typescript
export const securityMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Detectar tentativas de força bruta
  const clientIP = req.ip;
  const endpoint = req.path;
  
  // Rate limiting por IP e endpoint
  if (endpoint.includes('/login')) {
    // Implementar contador de tentativas de login
    checkLoginAttempts(clientIP);
  }
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log de requisições suspeitas (muito lentas ou com erro)
    if (duration > 5000 || res.statusCode >= 400) {
      console.warn('🚨 Requisição suspeita:', {
        ip: clientIP,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        userAgent: req.get('User-Agent')
      });
    }
  });
  
  next();
};
```

---

## 🛡️ CHECKLIST DE SEGURANÇA

### ✅ **Implementado**
- [x] Prepared statements para todas as queries
- [x] Hash de senhas com bcrypt
- [x] JWT com expiração
- [x] Validação de entrada com Joi
- [x] Rate limiting
- [x] Headers de segurança (Helmet)
- [x] CORS configurado
- [x] Logs de auditoria
- [x] Controle de acesso por roles

### 🔧 **Recomendado Implementar**
- [ ] Criptografia de dados sensíveis (CPF, RG)
- [ ] Detecção de SQL injection
- [ ] Logs de segurança detalhados
- [ ] Backup criptografado automático
- [ ] SSL/TLS para conexões
- [ ] Monitoramento de tentativas de invasão
- [ ] Sanitização avançada de entrada
- [ ] Configuração de firewall
- [ ] Alertas por email para atividades suspeitas
- [ ] Rotação automática de senhas

---

## 🚨 PROCEDIMENTOS DE EMERGÊNCIA

### **Em Caso de Suspeita de Invasão:**

1. **Isolar o Sistema**
   ```batch
   :: Parar serviços
   net stop postgresql-x64-18
   net stop "ADJPA API"
   ```

2. **Analisar Logs**
   ```sql
   -- Verificar tentativas de login suspeitas
   SELECT * FROM audit_logs 
   WHERE action = 'LOGIN_ATTEMPT' 
   AND created_at > NOW() - INTERVAL '24 hours'
   ORDER BY created_at DESC;
   
   -- Verificar alterações não autorizadas
   SELECT * FROM audit_logs 
   WHERE action IN ('UPDATE', 'DELETE', 'INSERT')
   AND created_at > NOW() - INTERVAL '24 hours'
   ORDER BY created_at DESC;
   ```

3. **Restaurar Backup**
   ```batch
   :: Descriptografar backup
   gpg --decrypt backup_file.gpg > backup_file.sql
   
   :: Restaurar banco
   psql -h localhost -U postgres -d adjpa_erp < backup_file.sql
   ```

4. **Alterar Credenciais**
   ```sql
   -- Alterar senhas de todos os usuários
   UPDATE users SET password_hash = hash_password('nova_senha_temporaria');
   
   -- Invalidar todas as sessões
   UPDATE user_sessions SET expires_at = NOW();
   ```

---

## 📞 CONTATOS DE EMERGÊNCIA

- **Desenvolvedor:** desenvolvedor@adjpa.com
- **Administrador:** admin@adjpa.com
- **Suporte Técnico:** [definir contato]

---

## 📚 REFERÊNCIAS

- [OWASP SQL Injection Prevention](https://owasp.org/www-community/attacks/SQL_Injection)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

---

**Última atualização:** Fevereiro 2026  
**Versão:** 1.0.0