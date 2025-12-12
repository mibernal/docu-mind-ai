//apps\api\src\modules\auth\auth.routes.ts
import { Router } from 'express';
import { register, login, logout, getMe } from './auth.controller';
import { validate } from '../../core/middleware/validation.middleware';
import { authMiddleware } from './auth.middleware';
import { registerSchema, loginSchema } from "../../shared/validation";
//import { authController } from './auth.controller';
const router = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);
export default router;
