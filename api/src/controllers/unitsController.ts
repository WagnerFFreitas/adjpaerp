import { Response } from 'express';
import { query } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getUnits = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await query(`
    SELECT * FROM units
    ORDER BY is_headquarter DESC, name
  `);

  res.json(result.rows);
});

export const getUnit = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'SELECT * FROM units WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Unidade não encontrada', 404);
  }

  res.json(result.rows[0]);
});

export const createUnit = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = req.body;

  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

  const result = await query(`
    INSERT INTO units (${fields.join(', ')})
    VALUES (${placeholders})
    RETURNING *
  `, values);

  res.status(201).json(result.rows[0]);
});

export const updateUnit = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

  const result = await query(`
    UPDATE units
    SET ${setClause}
    WHERE id = $1
    RETURNING *
  `, [id, ...values]);

  if (result.rows.length === 0) {
    throw new AppError('Unidade não encontrada', 404);
  }

  res.json(result.rows[0]);
});
