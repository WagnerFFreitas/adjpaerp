import { Response } from 'express';
import { query, pool } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Sistema
 * ACESSO RESTRITO: Apenas desenvolvedores
 */

/**
 * Informações do banco de dados
 */
export const getDatabaseInfo = asyncHandler(async (req: AuthRequest, res: Response) => {
  const dbInfo = await query(`
    SELECT 
      pg_database.datname as database_name,
      pg_size_pretty(pg_database_size(pg_database.datname)) as size,
      (SELECT count(*) FROM pg_stat_activity WHERE datname = pg_database.datname) as connections
    FROM pg_database
    WHERE datname = current_database()
  `);

  const tableInfo = await query(`
    SELECT 
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
      n_live_tup as row_count
    FROM pg_stat_user_tables
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  `);

  res.json({
    database: dbInfo.rows[0],
    tables: tableInfo.rows,
    pool: {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    },
  });
});

/**
 * Executar query SQL customizada
 * CUIDADO: Apenas para desenvolvedores
 */
export const executeQuery = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { sql, params } = req.body;

  if (!sql) {
    throw new AppError('SQL é obrigatório', 400);
  }

  // Prevenir queries perigosas
  const dangerousKeywords = ['DROP', 'TRUNCATE', 'DELETE FROM users', 'DELETE FROM profiles'];
  const upperSQL = sql.toUpperCase();
  
  for (const keyword of dangerousKeywords) {
    if (upperSQL.includes(keyword)) {
      throw new AppError(`Query contém palavra-chave perigosa: ${keyword}`, 400);
    }
  }

  try {
    const result = await query(sql, params);
    
    res.json({
      success: true,
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields?.map(f => ({
        name: f.name,
        dataType: f.dataTypeID,
      })),
    });
  } catch (error: any) {
    throw new AppError(`Erro ao executar query: ${error.message}`, 400);
  }
});

/**
 * Logs de auditoria
 */
export const getAuditLogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { user_id, action, table_name, start_date, end_date, page = 1, limit = 100 } = req.query;
  
  const offset = (Number(page) - 1) * Number(limit);
  
  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramCount = 1;

  if (user_id) {
    whereClause += ` AND user_id = $${paramCount}`;
    params.push(user_id);
    paramCount++;
  }

  if (action) {
    whereClause += ` AND action = $${paramCount}`;
    params.push(action);
    paramCount++;
  }

  if (table_name) {
    whereClause += ` AND table_name = $${paramCount}`;
    params.push(table_name);
    paramCount++;
  }

  if (start_date) {
    whereClause += ` AND created_at >= $${paramCount}`;
    params.push(start_date);
    paramCount++;
  }

  if (end_date) {
    whereClause += ` AND created_at <= $${paramCount}`;
    params.push(end_date);
    paramCount++;
  }

  const result = await query(`
    SELECT 
      al.*,
      p.name as user_name,
      p.username
    FROM audit_logs al
    LEFT JOIN profiles p ON p.user_id = al.user_id
    ${whereClause}
    ORDER BY al.created_at DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `, [...params, limit, offset]);

  const countResult = await query(`
    SELECT COUNT(*) as total FROM audit_logs ${whereClause}
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

/**
 * Estatísticas do sistema
 */
export const getSystemStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await query(`
    SELECT 
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM members) as total_members,
      (SELECT COUNT(*) FROM employees) as total_employees,
      (SELECT COUNT(*) FROM transactions) as total_transactions,
      (SELECT COUNT(*) FROM events) as total_events,
      (SELECT COUNT(*) FROM units) as total_units,
      (SELECT COUNT(*) FROM audit_logs) as total_audit_logs,
      (SELECT COUNT(*) FROM user_sessions WHERE expires_at > NOW()) as active_sessions
  `);

  const recentActivity = await query(`
    SELECT 
      action,
      table_name,
      COUNT(*) as count
    FROM audit_logs
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY action, table_name
    ORDER BY count DESC
    LIMIT 10
  `);

  res.json({
    stats: stats.rows[0],
    recentActivity: recentActivity.rows,
  });
});

/**
 * Backup do banco de dados
 */
export const createBackup = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Esta função retorna instruções para fazer backup
  // O backup real deve ser feito via pg_dump no sistema operacional
  
  const dbName = process.env.DB_NAME || 'adjpa_erp';
  const dbUser = process.env.DB_USER || 'adjpa_user';
  
  res.json({
    message: 'Para criar backup, execute o comando abaixo no terminal:',
    commands: {
      windows: `pg_dump -U ${dbUser} -F c -b -v -f backup_%date:~-4,4%%date:~-7,2%%date:~-10,2%.backup ${dbName}`,
      linux: `pg_dump -U ${dbUser} -F c -b -v -f backup_$(date +%Y%m%d).backup ${dbName}`,
    },
    note: 'O backup será criado no diretório atual',
  });
});
