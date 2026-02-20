import { Router } from 'express';
import {
  getTaxConfigurations,
  getTaxConfiguration,
  createTaxConfiguration,
  updateTaxConfiguration,
  deleteTaxConfiguration,
  toggleTaxConfiguration,
} from '../controllers/taxConfigController';
import { authenticateToken } from '../middleware/auth';
import { requireDeveloper } from '../middleware/developerAuth';

const router = Router();

// Todas as rotas requerem autenticação E role de desenvolvedor
router.use(authenticateToken);
router.use(requireDeveloper);

router.get('/', getTaxConfigurations);
router.get('/:id', getTaxConfiguration);
router.post('/', createTaxConfiguration);
router.put('/:id', updateTaxConfiguration);
router.delete('/:id', deleteTaxConfiguration);
router.patch('/:id/toggle', toggleTaxConfiguration);

export default router;
