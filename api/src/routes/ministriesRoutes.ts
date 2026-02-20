import { Router } from 'express';
import {
  getMinistries,
  getMinistry,
  createMinistry,
  updateMinistry,
  deleteMinistry,
} from '../controllers/ministriesController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getMinistries);
router.get('/:id', getMinistry);
router.post('/', requireRole('admin', 'pastor', 'secretary'), createMinistry);
router.put('/:id', requireRole('admin', 'pastor', 'secretary'), updateMinistry);
router.delete('/:id', requireRole('admin'), deleteMinistry);

export default router;