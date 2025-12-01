import { Router } from 'express';
import { createTemplate, getTemplates, updateTemplate } from '../controllers/template.controller';
import { authMiddleware } from '../auth/auth.middleware';
const router = Router();
router.use(authMiddleware);
router.post('/', createTemplate);
router.get('/', getTemplates);
router.put('/:id', updateTemplate);
export default router;
