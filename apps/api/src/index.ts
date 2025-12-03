// apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { testConnection, prisma } from './shared/db';
import { logger } from './shared/logger';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import documentRoutes from './modules/documents/document.routes';
import preferenceRoutes from './modules/users/preferences.routes';

// Import middleware
import { apiLimiter, authLimiter } from './core/middleware/rateLimit.middleware';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/preferences', preferenceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'DocuMind AI API is running',
    timestamp: new Date().toISOString(),
    database: prisma ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error: any, req: any, res: any, next: any) => {
  logger.error('Server Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Inicialización del servidor
async function startServer() {
  try {
    // Probar conexión a la base de datos
    logger.info('🚀 Iniciando DocuMind AI API...');
    
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    app.listen(PORT, () => {
      logger.info(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
      logger.info(`📊 Prisma Studio: http://localhost:5555`);
      logger.info(`🌐 Cliente: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre limpio
process.on('SIGINT', async () => {
  logger.info('🛑 Apagando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('🛑 Terminando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export default app;