import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    unit_id: string;
    roles: string[];
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Developer tem acesso a tudo
    if (req.user.roles.includes('developer')) {
      return next();
    }

    // Admin tem acesso a tudo exceto recursos exclusivos de developer
    const hasRole = roles.some(role => req.user!.roles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({ 
        error: 'Permissão negada',
        required: roles,
        current: req.user.roles
      });
    }

    next();
  };
};
