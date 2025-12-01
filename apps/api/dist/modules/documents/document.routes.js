//server\src\routes\document.routes.ts
import { Router } from 'express';
import { uploadDocument, getDocuments, getDocument, getDocumentMetrics, getDocumentStatus } from './document.controller';
//import { documentController } from './document.controller';
//import { uploadMiddleware } from '../../core/middleware/upload.middleware';
import { authMiddleware } from '../auth/auth.middleware';
import { uploadLimiter } from '../../core/middleware/rateLimit.middleware';
import { upload, handleUploadError } from '../../core/middleware/upload.middleware';
const router = Router();
// Todas las rutas requieren autenticación
router.use(authMiddleware);
// Ruta de upload con multer
router.post('/upload', uploadLimiter, upload.single('document'), // 'document' debe coincidir con el nombre del campo en FormData
handleUploadError, uploadDocument);
router.get('/', getDocuments);
router.get('/metrics', getDocumentMetrics);
router.get('/:id', getDocument);
router.get('/:id/status', getDocumentStatus);
export default router;
