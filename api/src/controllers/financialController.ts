import { Response } from 'express';
import { query } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { unit_id, type, status, start_date, end_date, page = 1, limit = 50 } = req.query;
  
  const offset = (Number(page) - 1) * Number(limit);
  
  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (unit_id) {
    whereClause += ` AND unit_id = $${paramCount}`;
    params.push(unit_id);
    paramCount++;
  }

  if (type) {
    whereClause += ` AND type = $${paramCount}`;
    params.push(type);
    paramCount++;
  }

  if (status) {
    whereClause += ` AND status = $${paramCount}`;
    params.push(status);
    paramCount++;
  }

  if (start_date) {
    whereClause += ` AND date >= $${paramCount}`;
    params.push(start_date);
    paramCount++;
  }

  if (end_date) {
    whereClause += ` AND date <= $${paramCount}`;
    params.push(end_date);
    paramCount++;
  }

  const result = await query(`
    SELECT 
      t.*,
      fa.name as account_name,
      fa.type as account_type
    FROM transactions t
    LEFT JOIN financial_accounts fa ON fa.id = t.account_id
    ${whereClause}
    ORDER BY t.date DESC, t.created_at DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `, [...params, limit, offset]);

  const countResult = await query(`
    SELECT COUNT(*) as total FROM transactions ${whereClause}
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

export const getTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    `SELECT t.*, fa.name as account_name
     FROM transactions t
     LEFT JOIN financial_accounts fa ON fa.id = t.account_id
     WHERE t.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Transação não encontrada', 404);
  }

  res.json(result.rows[0]);
});

export const createTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = req.body;

  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

  const result = await query(`
    INSERT INTO transactions (${fields.join(', ')})
    VALUES (${placeholders})
    RETURNING *
  `, values);

  res.status(201).json(result.rows[0]);
});

export const updateTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

  const result = await query(`
    UPDATE transactions
    SET ${setClause}
    WHERE id = $1
    RETURNING *
  `, [id, ...values]);

  if (result.rows.length === 0) {
    throw new AppError('Transação não encontrada', 404);
  }

  res.json(result.rows[0]);
});

export const deleteTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'DELETE FROM transactions WHERE id = $1 RETURNING id',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Transação não encontrada', 404);
  }

  res.json({ success: true, message: 'Transação excluída com sucesso' });
});

export const getAccounts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { unit_id } = req.query;

  let whereClause = 'WHERE 1=1';
  const params: any[] = [];

  if (unit_id) {
    whereClause += ' AND unit_id = $1';
    params.push(unit_id);
  }

  const result = await query(`
    SELECT * FROM financial_accounts
    ${whereClause}
    ORDER BY name
  `, params);

  res.json(result.rows);
});
