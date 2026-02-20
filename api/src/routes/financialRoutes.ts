import { Router } from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAccounts,
} from '../controllers/financialController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/transactions', getTransactions);
router.get('/transactions/:id', getTransaction);
router.post('/transactions', requireRole('admin', 'treasurer'), createTransaction);
router.put('/transactions/:id', requireRole('admin', 'treasurer'), updateTransaction);
router.delete('/transactions/:id', requireRole('admin'), deleteTransaction);

router.get('/accounts', getAccounts);

export default router;
