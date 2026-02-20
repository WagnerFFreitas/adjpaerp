import { Router } from 'express';
import { login, logout, me, changePassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validator';
import Joi from 'joi';

const router = Router();

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, me);
router.post('/change-password', authenticateToken, validate(changePasswordSchema), changePassword);

export default router;
