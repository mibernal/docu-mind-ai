// src/routes/preferences.routes.ts
import { Router } from 'express';
import { 
  setUserPreferences, 
  getUserPreferences,
  updateUserPreferences,
  getPredefinedTemplates,
  addCustomField,
  deleteCustomField
} from '../controllers/onboarding.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { onboardingSchema, customFieldSchema } from '../utils/validation';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Establecer preferencias (onboarding)
router.post('/onboarding', validate(onboardingSchema), setUserPreferences);

// Obtener preferencias del usuario
router.get('/', getUserPreferences);

// Actualizar preferencias
router.put('/', validate(onboardingSchema), updateUserPreferences);

// Obtener plantillas predefinidas
router.get('/templates/predefined', getPredefinedTemplates);

// Gestión de campos personalizados
router.post('/custom-fields', validate(customFieldSchema), addCustomField);
router.delete('/custom-fields/:id', deleteCustomField);

export default router;