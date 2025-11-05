import { Router } from 'express';
import { 
  uploadDocument, 
  getDocuments, 
  getDocument, 
  getDocumentMetrics 
} from '../controllers/document.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadLimiter } from '../middleware/rateLimit.middleware';
import { upload, handleUploadError } from '../middleware/upload.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Ruta de upload con multer
router.post(
  '/upload', 
  uploadLimiter,
  upload.single('document'), // 'document' debe coincidir con el nombre del campo en FormData
  handleUploadError,
  uploadDocument
);

router.get('/', getDocuments);
router.get('/metrics', getDocumentMetrics);
router.get('/:id', getDocument);

export default router;