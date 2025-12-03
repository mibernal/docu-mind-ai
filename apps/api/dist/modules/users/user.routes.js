// apps/api/src/modules/users/user.routes.ts
import { Router } from 'express';
import { getProfile, updateProfile, updateOrganization, getUsageStats, deleteAccount } from './user.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { validate } from '../../core/middleware/validation.middleware';
import { updateProfileSchema } from "../../shared/validation";
import { apiLimiter } from '../../core/middleware/rateLimit.middleware';
const router = Router();
// Aplicar rate limiting
router.use(apiLimiter);
// Requiere autenticación
router.use(authMiddleware);
// Perfil
router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);
// Organización
router.put('/organization', updateOrganization);
// Estadísticas
router.get('/usage', getUsageStats);
// Eliminar cuenta
router.delete('/account', deleteAccount);
export default router;
