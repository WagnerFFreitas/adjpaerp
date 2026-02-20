import { Router } from 'express';
import {
  getDatabaseInfo,
  executeQuery,
  getAuditLogs,
  getSystemStats,
  createBackup,
} from '../controllers/systemController';
import { authenticateToken } from '../middleware/auth';
import { requireDeveloper } from '../middleware/developerAuth';

const router = Router();

// Todas as rotas requerem autenticação E role de desenvolvedor
router.use(authenticateToken);
router.use(requireDeveloper);

router.get('/database', getDatabaseInfo);
router.post('/query', executeQuery);
router.get('/audit-logs', getAuditLogs);
router.get('/stats', getSystemStats);
router.post('/backup', createBackup);

export default router;
