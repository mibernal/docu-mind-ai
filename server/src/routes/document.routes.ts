import { Router } from 'express';
import { 
  uploadDocument, 
  getDocuments, 
  getDocument, 
  getDocumentMetrics 
} from '../controllers/document.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de documentos
router.post('/upload', uploadLimiter, uploadDocument);
router.get('/', getDocuments);
router.get('/metrics', getDocumentMetrics);
router.get('/:id', getDocument);

export default router;