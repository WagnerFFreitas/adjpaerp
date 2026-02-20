import { Router } from 'express';
import authRoutes from './authRoutes';
import membersRoutes from './membersRoutes';
import employeesRoutes from './employeesRoutes';
import financialRoutes from './financialRoutes';
import unitsRoutes from './unitsRoutes';
import taxConfigRoutes from './taxConfigRoutes';
import systemRoutes from './systemRoutes';
import uploadRoutes from './uploadRoutes';
import ministriesRoutes from './ministriesRoutes';
import cellsRoutes from './cellsRoutes';
import contributionsRoutes from './contributionsRoutes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ADJPA ERP API'
  });
});

// Rotas
router.use('/auth', authRoutes);
router.use('/members', membersRoutes);
router.use('/employees', employeesRoutes);
router.use('/financial', financialRoutes);
router.use('/units', unitsRoutes);
router.use('/upload', uploadRoutes);
router.use('/ministries', ministriesRoutes);
router.use('/cells', cellsRoutes);
router.use('/contributions', contributionsRoutes);

// Rotas restritas a desenvolvedores
router.use('/tax-config', taxConfigRoutes);
router.use('/system', systemRoutes);

export default router;
