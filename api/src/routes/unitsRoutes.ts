import { Router } from 'express';
import {
  getUnits,
  getUnit,
  createUnit,
  updateUnit,
} from '../controllers/unitsController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getUnits);
router.get('/:id', getUnit);
router.post('/', requireRole('admin'), createUnit);
router.put('/:id', requireRole('admin'), updateUnit);

export default router;
