import { Router } from 'express';
import { 
  uploadDocument, 
  getDocuments, 
  getDocument, 
  getDocumentMetrics,
  getDocumentStatus,
  deleteDocument
} from './document.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { uploadLimiter } from '../../core/middleware/rateLimit.middleware';
import { upload, handleUploadError } from '../../core/middleware/upload.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Ruta de upload con multer
router.post(
  '/upload', 
  uploadLimiter,
  upload.single('document'),
  handleUploadError,
  uploadDocument
);

// Rutas CRUD para documentos
router.get('/', getDocuments);
router.get('/metrics', getDocumentMetrics);
router.get('/:id', getDocument);
router.get('/:id/status', getDocumentStatus);
router.delete('/:id', deleteDocument);

export default router;