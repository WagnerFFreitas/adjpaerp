import { Response } from 'express';
import { query } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getCells = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { unit_id, is_active } = req.query;
  
  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (unit_id) {
    whereClause += ` AND c.unit_id = $${paramCount}`;
    params.push(unit_id);
    paramCount++;
  }

  if (is_active !== undefined) {
    whereClause += ` AND c.is_active = $${paramCount}`;
    params.push(is_active === 'true');
    paramCount++;
  }

  const result = await query(`
    SELECT 
      c.*,
      m.name as leader_name,
      u.name as unit_name,
      (SELECT COUNT(*) FROM members WHERE cell_group = c.name) as members_count
    FROM cells c
    LEFT JOIN members m ON m.id = c.leader_id
    LEFT JOIN units u ON u.id = c.unit_id
    ${whereClause}
    ORDER BY c.name
  `, params);

  res.json(result.rows);
});

export const getCell = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(`
    SELECT 
      c.*,
      m.name as leader_name,
      u.name as unit_name
    FROM cells c
    LEFT JOIN members m ON m.id = c.leader_id
    LEFT JOIN units u ON u.id = c.unit_id
    WHERE c.id = $1
  `, [id]);

  if (result.rows.length === 0) {
    throw new AppError('Célula não encontrada', 404);
  }

  res.json(result.rows[0]);
});

export const createCell = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description, leader_id, location, meeting_day, meeting_time, unit_id, is_active } = req.body;

  if (!name || !unit_id) {
    throw new AppError('Nome e unidade são obrigatórios', 400);
  }

  const result = await query(`
    INSERT INTO cells (name, description, leader_id, location, meeting_day, meeting_time, unit_id, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `, [name, description, leader_id, location, meeting_day, meeting_time, unit_id, is_active !== false]);

  res.status(201).json(result.rows[0]);
});

export const updateCell = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, leader_id, location, meeting_day, meeting_time, unit_id, is_active } = req.body;

  const result = await query(`
    UPDATE cells
    SET 
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      leader_id = $3,
      location = COALESCE($4, location),
      meeting_day = COALESCE($5, meeting_day),
      meeting_time = COALESCE($6, meeting_time),
      unit_id = COALESCE($7, unit_id),
      is_active = COALESCE($8, is_active),
      updated_at = NOW()
    WHERE id = $9
    RETURNING *
  `, [name, description, leader_id, location, meeting_day, meeting_time, unit_id, is_active, id]);

  if (result.rows.length === 0) {
    throw new AppError('Célula não encontrada', 404);
  }

  res.json(result.rows[0]);
});

export const deleteCell = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'DELETE FROM cells WHERE id = $1 RETURNING id',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Célula não encontrada', 404);
  }

  res.json({ success: true, message: 'Célula excluída com sucesso' });
});