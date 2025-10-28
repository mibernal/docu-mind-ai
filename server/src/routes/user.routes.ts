import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  updateOrganization, 
  getUsageStats, 
  deleteAccount 
} from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { updateProfileSchema } from '../utils/validation';
import { apiLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Aplicar rate limiting a todas las rutas de usuario
router.use(apiLimiter);

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de perfil de usuario
router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);

// Rutas de organización
router.put('/organization', updateOrganization);

// Rutas de estadísticas y uso
router.get('/usage', getUsageStats);

// Rutas de gestión de cuenta
router.delete('/account', deleteAccount);

export default router;