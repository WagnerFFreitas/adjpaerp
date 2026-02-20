import { Response } from 'express';
import { query } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getEmployees = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { unit_id, status, search, page = 1, limit = 50 } = req.query;
  
  const offset = (Number(page) - 1) * Number(limit);
  
  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (unit_id) {
    whereClause += ` AND unit_id = $${paramCount}`;
    params.push(unit_id);
    paramCount++;
  }

  if (status) {
    whereClause += ` AND status = $${paramCount}`;
    params.push(status);
    paramCount++;
  }

  if (search) {
    whereClause += ` AND (
      name ILIKE $${paramCount} OR 
      cpf ILIKE $${paramCount} OR 
      email ILIKE $${paramCount}
    )`;
    params.push(`%${search}%`);
    paramCount++;
  }

  const result = await query(`
    SELECT 
      id, name, cpf, email, phone, birth_date,
      position, department, admission_date, salary,
      status, unit_id, photo_url, created_at, updated_at
    FROM employees
    ${whereClause}
    ORDER BY name
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `, [...params, limit, offset]);

  const countResult = await query(`
    SELECT COUNT(*) as total FROM employees ${whereClause}
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

export const getEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'SELECT * FROM employees WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Funcionário não encontrado', 404);
  }

  res.json(result.rows[0]);
});

export const createEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = req.body;

  if (data.cpf) {
    const existing = await query(
      'SELECT id FROM employees WHERE cpf = $1',
      [data.cpf]
    );
    if (existing.rows.length > 0) {
      throw new AppError('CPF já cadastrado', 400);
    }
  }

  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

  const result = await query(`
    INSERT INTO employees (${fields.join(', ')})
    VALUES (${placeholders})
    RETURNING *
  `, values);

  res.status(201).json(result.rows[0]);
});

export const updateEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

  const result = await query(`
    UPDATE employees
    SET ${setClause}
    WHERE id = $1
    RETURNING *
  `, [id, ...values]);

  if (result.rows.length === 0) {
    throw new AppError('Funcionário não encontrado', 404);
  }

  res.json(result.rows[0]);
});

export const updateEmployeePhoto = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { photo_url } = req.body;

  if (!photo_url) {
    throw new AppError('URL da foto é obrigatória', 400);
  }

  const result = await query(`
    UPDATE employees
    SET photo_url = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, name, photo_url
  `, [photo_url, id]);

  if (result.rows.length === 0) {
    throw new AppError('Funcionário não encontrado', 404);
  }

  res.json({
    success: true,
    message: 'Foto do funcionário atualizada com sucesso',
    data: result.rows[0]
  });
});

export const deleteEmployee = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'DELETE FROM employees WHERE id = $1 RETURNING id',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Funcionário não encontrado', 404);
  }

  res.json({ success: true, message: 'Funcionário excluído com sucesso' });
});
