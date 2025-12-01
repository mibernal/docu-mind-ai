import { Router } from 'express';
import { createTemplate, getTemplates, updateTemplate, deleteTemplate } from './template.controller.js';
import { authMiddleware } from '../auth/auth.middleware.js';
// REMOVER validación temporalmente - agregar después
// import { validate } from '../../core/middleware/validation.middleware.js';
const router = Router();
// proteger todas las rutas de templates
router.use(authMiddleware);
// REMOVER validate temporalmente hasta crear esquemas
router.post('/', createTemplate); // validate(/* validatorSchema? */) removido
router.get('/', getTemplates);
router.put('/:id', updateTemplate); // validate(/* validatorSchema? */) removido
router.delete('/:id', deleteTemplate);
export default router;
