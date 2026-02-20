import { Response } from 'express';
import { query } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getMinistries = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { unit_id, is_active } = req.query;
  
  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (unit_id) {
    whereClause += ` AND unit_id = $${paramCount}`;
    params.push(unit_id);
    paramCount++;
  }

  if (is_active !== undefined) {
    whereClause += ` AND is_active = $${paramCount}`;
    params.push(is_active === 'true');
    paramCount++;
  }

  const result = await query(`
    SELECT 
      m.*,
      p.name as leader_name,
      u.name as unit_name,
      (SELECT COUNT(*) FROM members WHERE main_ministry = m.name) as members_count
    FROM ministries m
    LEFT JOIN members p ON p.id = m.leader_id
    LEFT JOIN units u ON u.id = m.unit_id
    ${whereClause}
    ORDER BY m.name
  `, params);

  res.json(result.rows);
});

export const getMinistry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(`
    SELECT 
      m.*,
      p.name as leader_name,
      u.name as unit_name
    FROM ministries m
    LEFT JOIN members p ON p.id = m.leader_id
    LEFT JOIN units u ON u.id = m.unit_id
    WHERE m.id = $1
  `, [id]);

  if (result.rows.length === 0) {
    throw new AppError('Ministério não encontrado', 404);
  }

  res.json(result.rows[0]);
});

export const createMinistry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description, leader_id, unit_id, is_active } = req.body;

  if (!name || !unit_id) {
    throw new AppError('Nome e unidade são obrigatórios', 400);
  }

  const result = await query(`
    INSERT INTO ministries (name, description, leader_id, unit_id, is_active)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [name, description, leader_id, unit_id, is_active !== false]);

  res.status(201).json(result.rows[0]);
});

export const updateMinistry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, leader_id, unit_id, is_active } = req.body;

  const result = await query(`
    UPDATE ministries
    SET 
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      leader_id = $3,
      unit_id = COALESCE($4, unit_id),
      is_active = COALESCE($5, is_active),
      updated_at = NOW()
    WHERE id = $6
    RETURNING *
  `, [name, description, leader_id, unit_id, is_active, id]);

  if (result.rows.length === 0) {
    throw new AppError('Ministério não encontrado', 404);
  }

  res.json(result.rows[0]);
});

export const deleteMinistry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'DELETE FROM ministries WHERE id = $1 RETURNING id',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Ministério não encontrado', 404);
  }

  res.json({ success: true, message: 'Ministério excluído com sucesso' });
});