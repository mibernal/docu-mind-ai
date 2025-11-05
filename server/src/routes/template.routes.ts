import { Router } from 'express';
import { 
  createTemplate, 
  getTemplates, 
  updateTemplate 
} from '../controllers/template.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createTemplate);
router.get('/', getTemplates);
router.put('/:id', updateTemplate);

export default router;