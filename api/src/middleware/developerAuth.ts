import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Middleware para verificar se o usuário é desenvolvedor
 * Apenas desenvolvedores têm acesso a recursos críticos:
 * - Configurações fiscais
 * - Certificados digitais
 * - Acesso direto ao banco de dados
 * - Configurações avançadas do sistema
 */
export const requireDeveloper = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const isDeveloper = req.user.roles.includes('developer');
  
  if (!isDeveloper) {
    return res.status(403).json({ 
      error: 'Acesso negado',
      message: 'Apenas desenvolvedores têm acesso a este recurso',
      required: ['developer'],
      current: req.user.roles
    });
  }

  next();
};

/**
 * Middleware para verificar se é desenvolvedor OU admin
 * Para recursos que podem ser acessados por ambos
 */
export const requireDeveloperOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const hasAccess = req.user.roles.includes('developer') || 
                    req.user.roles.includes('admin');
  
  if (!hasAccess) {
    return res.status(403).json({ 
      error: 'Acesso negado',
      message: 'Apenas desenvolvedores ou administradores têm acesso',
      required: ['developer', 'admin'],
      current: req.user.roles
    });
  }

  next();
};
