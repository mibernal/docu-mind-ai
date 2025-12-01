// server/src/routes/user.routes.ts
import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  updateOrganization, 
  getUsageStats, 
  deleteAccount 
} from './user.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { validate } from '../../core/middleware/validation.middleware';
import { updateProfileSchema } from "../../shared/validation";
import { apiLimiter } from '../../core/middleware/rateLimit.middleware';
//import { userController } from './user.controller';


const router = Router();

// Aplicar rate limiting a todas las rutas de usuario
router.use(apiLimiter);

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de perfil de usuario
router.get('/profile', getProfile);
// CORRECCIÓN: Usar el esquema correctamente
router.put('/profile', validate(updateProfileSchema as any), updateProfile);

// Rutas de organización
router.put('/organization', updateOrganization);

// Rutas de estadísticas y uso
router.get('/usage', getUsageStats);

// Rutas de gestión de cuenta
router.delete('/account', deleteAccount);

export default router;