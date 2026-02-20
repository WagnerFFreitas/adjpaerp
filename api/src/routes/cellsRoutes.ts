import { Router } from 'express';
import {
  getCells,
  getCell,
  createCell,
  updateCell,
  deleteCell,
} from '../controllers/cellsController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getCells);
router.get('/:id', getCell);
router.post('/', requireRole('admin', 'pastor', 'secretary'), createCell);
router.put('/:id', requireRole('admin', 'pastor', 'secretary'), updateCell);
router.delete('/:id', requireRole('admin'), deleteCell);

export default router;