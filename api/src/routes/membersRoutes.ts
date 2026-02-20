import { Router } from 'express';
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/membersController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

router.get('/', getMembers);
router.get('/:id', getMember);
router.post('/', requireRole('admin', 'secretary'), createMember);
router.put('/:id', requireRole('admin', 'secretary'), updateMember);
router.delete('/:id', requireRole('admin'), deleteMember);

export default router;
