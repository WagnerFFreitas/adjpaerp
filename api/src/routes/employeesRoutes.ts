import { Router } from 'express';
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  updateEmployeePhoto,
  deleteEmployee,
} from '../controllers/employeesController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', requireRole('admin', 'hr'), createEmployee);
router.put('/:id', requireRole('admin', 'hr'), updateEmployee);
router.patch('/:id/photo', requireRole('admin', 'hr'), updateEmployeePhoto);
router.delete('/:id', requireRole('admin'), deleteEmployee);

export default router;
