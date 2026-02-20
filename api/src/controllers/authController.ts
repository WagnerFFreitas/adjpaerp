import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email e senha são obrigatórios', 400);
  }

  try {
    // Buscar usuário diretamente
    const userResult = await query(`
      SELECT 
        u.id,
        u.email,
        u.password_hash,
        p.name,
        p.username,
        p.default_unit_id,
        ARRAY_AGG(DISTINCT ur.role) as roles
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      WHERE u.email = $1 AND u.email_confirmed = true
      GROUP BY u.id, u.email, u.password_hash, p.name, p.username, p.default_unit_id
    `, [email]);

    if (userResult.rows.length === 0) {
      throw new AppError('Usuário não encontrado', 401);
    }

    const user = userResult.rows[0];

    // Verificar senha usando crypt diretamente
    const passwordCheck = await query(
      'SELECT $1 = crypt($2, $1) as valid',
      [user.password_hash, password]
    );

    if (!passwordCheck.rows[0].valid) {
      throw new AppError('Senha incorreta', 401);
    }

    // Gerar JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError('JWT_SECRET não configurado', 500);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        unit_id: user.default_unit_id,
        roles: user.roles || [],
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRATION || '7d' }
    );

    // Atualizar último login
    await query(
      'UPDATE users SET last_sign_in_at = now() WHERE id = $1',
      [user.id]
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        unit_id: user.default_unit_id,
        roles: user.roles,
      },
    });
  } catch (error: any) {
    console.error('Erro no login:', error);
    throw new AppError(error.message || 'Erro interno no login', 500);
  }
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token && req.user) {
    await query(
      'UPDATE user_sessions SET expires_at = NOW() WHERE token = $1',
      [token]
    );
  }

  res.json({ success: true, message: 'Logout realizado com sucesso' });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userResult = await query(`
    SELECT 
      u.id,
      u.email,
      u.email_confirmed,
      p.name,
      p.username,
      p.avatar_url,
      p.phone,
      p.default_unit_id,
      un.name as unit_name,
      ARRAY_AGG(DISTINCT ur.role) as roles
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    LEFT JOIN user_roles ur ON ur.user_id = u.id
    LEFT JOIN units un ON un.id = p.default_unit_id
    WHERE u.id = $1
    GROUP BY u.id, u.email, u.email_confirmed, p.name, p.username, 
             p.avatar_url, p.phone, p.default_unit_id, un.name
  `, [req.user!.id]);

  if (userResult.rows.length === 0) {
    throw new AppError('Usuário não encontrado', 404);
  }

  res.json(userResult.rows[0]);
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Senha atual e nova senha são obrigatórias', 400);
  }

  // Verificar senha atual
  const verifyResult = await query(
    'SELECT verify_password($1, $2) as valid',
    [req.user!.id, currentPassword]
  );

  if (!verifyResult.rows[0].valid) {
    throw new AppError('Senha atual incorreta', 401);
  }

  // Atualizar senha
  await query(
    'UPDATE users SET password_hash = hash_password($1) WHERE id = $2',
    [newPassword, req.user!.id]
  );

  res.json({ success: true, message: 'Senha alterada com sucesso' });
});
