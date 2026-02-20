import { Router } from 'express';
import { uploadPhoto, deletePhoto, getPhoto } from '../controllers/uploadController';
import { uploadPhoto as uploadMiddleware } from '../middleware/upload';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas de upload precisam de autenticação
router.use(authenticateToken);

// Upload de foto
router.post('/photo', uploadMiddleware, uploadPhoto);

// Deletar foto
router.delete('/photo/:filename', deletePhoto);

// Obter foto (público após autenticação)
router.get('/photo/:filename', getPhoto);

export default router;