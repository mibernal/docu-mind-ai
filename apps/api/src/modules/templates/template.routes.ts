import { Router } from 'express';
import { 
  createTemplate, 
  getTemplates, 
  updateTemplate,
  deleteTemplate
} from './template.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { validate } from '../../core/middleware/validation.middleware';

const router = Router();

// proteger todas las rutas de templates
router.use(authMiddleware);

router.post('/', validate(/* validatorSchema? */), createTemplate);
router.get('/', getTemplates);
router.put('/:id', validate(/* validatorSchema? */), updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
