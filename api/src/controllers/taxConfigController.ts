import { Response } from 'express';
import { query } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Configurações Fiscais
 * ACESSO RESTRITO: Apenas desenvolvedores
 */

export const getTaxConfigurations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, is_active } = req.query;
  
  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (type) {
    whereClause += ` AND type = $${paramCount}`;
    params.push(type);
    paramCount++;
  }

  if (is_active !== undefined) {
    whereClause += ` AND is_active = $${paramCount}`;
    params.push(is_active === 'true');
    paramCount++;
  }

  const result = await query(`
    SELECT * FROM tax_configurations
    ${whereClause}
    ORDER BY valid_from DESC, name
  `, params);

  res.json(result.rows);
});

export const getTaxConfiguration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'SELECT * FROM tax_configurations WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Configuração fiscal não encontrada', 404);
  }

  res.json(result.rows[0]);
});

export const createTaxConfiguration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = req.body;

  // Validar dados obrigatórios
  if (!data.name || !data.type) {
    throw new AppError('Nome e tipo são obrigatórios', 400);
  }

  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

  const result = await query(`
    INSERT INTO tax_configurations (${fields.join(', ')})
    VALUES (${placeholders})
    RETURNING *
  `, values);

  res.status(201).json(result.rows[0]);
});

export const updateTaxConfiguration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields.map((field, i) => `${field} = $${i + 2}`).join(', ');

  const result = await query(`
    UPDATE tax_configurations
    SET ${setClause}
    WHERE id = $1
    RETURNING *
  `, [id, ...values]);

  if (result.rows.length === 0) {
    throw new AppError('Configuração fiscal não encontrada', 404);
  }

  res.json(result.rows[0]);
});

export const deleteTaxConfiguration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await query(
    'DELETE FROM tax_configurations WHERE id = $1 RETURNING id',
    [id]
  );

  if (result.rows.length === 0) {
    throw new AppError('Configuração fiscal não encontrada', 404);
  }

  res.json({ success: true, message: 'Configuração fiscal excluída com sucesso' });
});

/**
 * Ativar/Desativar configuração fiscal
 */
export const toggleTaxConfiguration = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { is_active } = req.body;

  const result = await query(`
    UPDATE tax_configurations
    SET is_active = $1
    WHERE id = $2
    RETURNING *
  `, [is_active, id]);

  if (result.rows.length === 0) {
    throw new AppError('Configuração fiscal não encontrada', 404);
  }

  res.json(result.rows[0]);
});
