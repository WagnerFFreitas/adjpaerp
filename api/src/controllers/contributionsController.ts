import { Response } from 'express';
import { query } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getContributions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { member_id, unit_id, type, start_date, end_date, page = 1, limit = 50 } = req.query;
  
  const offset = (Number(page) - 1) * Number(limit);
  
  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (member_id) {
    whereClause += ` AND c.member_id = $${paramCount}`;
    params.push(member_id);
    paramCount++;
  }

  if (unit_id) {
    whereClause += ` AND c.unit_id = $${paramCount}`;
    params.push(unit_id);
    paramCount++;
  }

  if (type) {
    whereClause += ` AND c.type = $${paramCount}`;
    params.push(type);
    paramCount++;
  }

  if (start_date) {
    whereClause += ` AND c.date >= $${paramCount}`;
    params.push(start_date);
    paramCount++;
  }

  if (end_date) {
    whereClause += ` AND c.date <= $${paramCount}`;
    params.push(end_date);
    paramCount++;
  }

  const result = await query(`
    SELECT 
      c.*,
      m.name as member_name,
      u.name as unit_name
    FROM contributions c
    LEFT JOIN members m ON m.id = c.member_id
    LEFT JOIN units u ON u.id = c.unit_id
    ${whereClause}
    ORDER BY c.date DESC, c.created_at DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `, [...params, limit, offset]);

  const countResult = await query(`
    SELECT COUNT(*) as total FROM contributions c ${whereClause}
  `, params);

  res.json({
    data: result.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: parseInt(countResult.rows[0].total),
      pages: Math.ceil(countResult.rows[0].total / Number(limit)),
    },
  });
});

export const getContribution = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(`
    SELECT 
      c.*,
      m.name as member_name,
      u.name as unit_name
    FROM contributions c
    LEFT JOIN members m ON m.id = c.member_id
    LEFT JOIN units u ON u.id = c.unit_id
    WHERE c.id = $1
  `, [id]);

  if (result.rows.length === 0) {
    throw new AppError('Contribuição não encontrada', 404);
  }

  res.json(result.rows[0]);
});

export const createContribution = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { member_id, type, amount, date, payment_method, reference, description, unit_id } = req.body;

  if (!member_id || !type || !amount || !date || !unit_id) {
    throw new AppError('Membro, tipo, valor, data e unidade são obrigatórios', 400);
  }

  const result = await query(`
    INSERT INTO contributions (member_id, type, amount, date, payment_method, reference, description, unit_id, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `, [member_id, type, amount, date, payment_method, reference, description, unit_id, req.user!.id]);

  res.status(201).json(result.rows[0]);
});

export const updateContribution = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { member_id, type, amount, date, payment_method, reference, description, unit_id } = req.body;

  const result = await query(`
    UPDATE contributions
    SET 
      member_id = COALESCE($1, member_id),
      type = COALESCE($2, type),
      amount = COALESCE($3, amount),
      date = COALESCE($4, date),
      payment_method = COALESCE($5, payment_method),
      reference = COALESCE($6, reference),
      description = COALESCE($7, description),
      unit_id = COALESCE($8, unit_id),
      updated_at = NOW()
    WHERE id = $9
    RETURNING *
  `, [member_id, type, amount, date, payment_method, reference, description, unit_id, id]);

  if (result.rows.length === 0) {
    throw new AppError('Contribuição não encontrada', 404);
  }

  res.json(result.rows[0]);
});

export const deleteContribution = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'DELETE FROM contributions WHERE id = $1 RETURNING id',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Contribuição não encontrada', 404);
  }

  res.json({ success: true, message: 'Contribuição excluída com sucesso' });
});

// Estatísticas de contribuições
export const getContributionStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { member_id, unit_id, year } = req.query;

  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (member_id) {
    whereClause += ` AND member_id = $${paramCount}`;
    params.push(member_id);
    paramCount++;
  }

  if (unit_id) {
    whereClause += ` AND unit_id = $${paramCount}`;
    params.push(unit_id);
    paramCount++;
  }

  if (year) {
    whereClause += ` AND EXTRACT(YEAR FROM date) = $${paramCount}`;
    params.push(year);
    paramCount++;
  }

  const result = await query(`
    SELECT 
      type,
      COUNT(*) as count,
      SUM(amount) as total,
      AVG(amount) as average,
      MIN(amount) as min,
      MAX(amount) as max
    FROM contributions
    ${whereClause}
    GROUP BY type
    ORDER BY total DESC
  `, params);

  res.json(result.rows);
});