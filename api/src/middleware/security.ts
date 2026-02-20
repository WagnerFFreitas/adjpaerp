import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { query } from '../config/database';

/**
 * Middleware de Sanitização de Entrada
 * Remove XSS e caracteres perigosos
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Remove tags HTML e scripts
      value = validator.stripLow(value);
      value = validator.escape(value);
      return value.trim();
    }
    
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    
    return value;
  };

  // Sanitizar body, query e params
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  
  next();
};

/**
 * Detector de Tentativas de SQL Injection
 */
export const detectSQLInjection = async (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    // Comandos SQL básicos
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    // Caracteres de escape e comentários
    /(--|\/\*|\*\/|;)/,
    // Operadores lógicos suspeitos
    /(\bOR\b|\bAND\b).*(\b=\b|\bLIKE\b|\b1\b|\btrue\b)/i,
    // Tabelas do sistema
    /(INFORMATION_SCHEMA|SYSOBJECTS|SYSCOLUMNS|pg_tables|pg_user)/i,
    // Funções perigosas
    /(xp_|sp_|exec|execute|eval|script)/i,
    // Tentativas de bypass
    /('.*'|".*"|`.*`|\b1=1\b|\b1=1\b)/,
  ];

  const checkForSQLInjection = (obj: any, path = ''): boolean => {
    if (typeof obj === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(obj));
    }
    
    if (Array.isArray(obj)) {
      return obj.some((item, index) => 
        checkForSQLInjection(item, `${path}[${index}]`)
      );
    }
    
    if (typeof obj === 'object' && obj !== null) {
      return Object.entries(obj).some(([key, value]) => 
        checkForSQLInjection(value, path ? `${path}.${key}` : key)
      );
    }
    
    return false;
  };

  const hasSQLInjection = 
    checkForSQLInjection(req.body, 'body') ||
    checkForSQLInjection(req.query, 'query') ||
    checkForSQLInjection(req.params, 'params');

  if (hasSQLInjection) {
    const attackData = {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
      timestamp: new Date().toISOString()
    };

    // Log no console
    console.error('🚨 TENTATIVA DE SQL INJECTION DETECTADA:', attackData);

    // Registrar no banco de dados
    try {
      await query(`
        INSERT INTO security_logs (
          ip_address, user_agent, attack_type, 
          request_data, blocked, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
      `, [
        req.ip,
        req.get('User-Agent') || 'Unknown',
        'SQL_INJECTION_ATTEMPT',
        JSON.stringify(attackData),
        true
      ]);
    } catch (error) {
      console.error('Erro ao registrar tentativa de SQL injection:', error);
    }

    return res.status(400).json({
      error: 'Requisição bloqueada por motivos de segurança',
      code: 'SECURITY_VIOLATION'
    });
  }

  next();
};

/**
 * Monitoramento de Tentativas de Login
 */
const loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();

export const monitorLoginAttempts = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip;
  const maxAttempts = 5;
  const timeWindow = 15 * 60 * 1000; // 15 minutos

  if (req.path.includes('/login') && req.method === 'POST') {
    const now = new Date();
    const attempts = loginAttempts.get(clientIP);

    if (attempts) {
      // Resetar contador se passou do tempo limite
      if (now.getTime() - attempts.lastAttempt.getTime() > timeWindow) {
        loginAttempts.delete(clientIP);
      } else if (attempts.count >= maxAttempts) {
        console.warn(`🚨 IP ${clientIP} bloqueado por excesso de tentativas de login`);
        
        return res.status(429).json({
          error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
          code: 'TOO_MANY_ATTEMPTS'
        });
      }
    }

    // Interceptar resposta para contar tentativas falhadas
    const originalSend = res.send;
    res.send = function(data: any) {
      if (res.statusCode === 401 || res.statusCode === 400) {
        const current = loginAttempts.get(clientIP) || { count: 0, lastAttempt: now };
        loginAttempts.set(clientIP, {
          count: current.count + 1,
          lastAttempt: now
        });
      } else if (res.statusCode === 200) {
        // Login bem-sucedido, resetar contador
        loginAttempts.delete(clientIP);
      }
      
      return originalSend.call(this, data);
    };
  }

  next();
};

/**
 * Validação de CPF
 */
export const validateCPF = (cpf: string): boolean => {
  if (!cpf) return false;
  
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

/**
 * Validação de CNPJ
 */
export const validateCNPJ = (cnpj: string): boolean => {
  if (!cnpj) return false;
  
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/[^\d]/g, '');
  
  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  // Validação do primeiro dígito verificador
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cnpj.charAt(12))) return false;
  
  // Validação do segundo dígito verificador
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cnpj.charAt(13))) return false;
  
  return true;
};

/**
 * Middleware de Validação de Documentos
 */
export const validateDocuments = (req: Request, res: Response, next: NextFunction) => {
  const { cpf, cnpj } = req.body;
  
  if (cpf && !validateCPF(cpf)) {
    return res.status(400).json({
      error: 'CPF inválido',
      field: 'cpf'
    });
  }
  
  if (cnpj && !validateCNPJ(cnpj)) {
    return res.status(400).json({
      error: 'CNPJ inválido',
      field: 'cnpj'
    });
  }
  
  next();
};

/**
 * Middleware de Monitoramento de Performance
 */
export const performanceMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const clientIP = req.ip;
  
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    const isSlowRequest = duration > 5000; // > 5 segundos
    const hasError = res.statusCode >= 400;
    
    if (isSlowRequest || hasError) {
      const logData = {
        ip: clientIP,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      };
      
      console.warn('🐌 Requisição lenta ou com erro:', logData);
      
      // Registrar no banco se for muito crítico
      if (duration > 10000 || res.statusCode >= 500) {
        try {
          await query(`
            INSERT INTO security_logs (
              ip_address, user_agent, attack_type, 
              request_data, blocked, created_at
            ) VALUES ($1, $2, $3, $4, $5, NOW())
          `, [
            clientIP,
            req.get('User-Agent') || 'Unknown',
            isSlowRequest ? 'SLOW_REQUEST' : 'ERROR_REQUEST',
            JSON.stringify(logData),
            false
          ]);
        } catch (error) {
          console.error('Erro ao registrar log de performance:', error);
        }
      }
    }
  });
  
  next();
};