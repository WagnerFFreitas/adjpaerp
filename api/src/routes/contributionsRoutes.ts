import { Router } from 'express';
import {
  getContributions,
  getContribution,
  createContribution,
  updateContribution,
  deleteContribution,
  getContributionStats,
} from '../controllers/contributionsController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getContributions);
router.get('/stats', getContributionStats);
router.get('/:id', getContribution);
router.post('/', requireRole('admin', 'treasurer', 'secretary'), createContribution);
router.put('/:id', requireRole('admin', 'treasurer'), updateContribution);
router.delete('/:id', requireRole('admin'), deleteContribution);

export default router;