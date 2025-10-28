import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { apiLimiter, authLimiter } from './middleware/rateLimit.middleware';
import { testConnection } from './lib/db'; // ← Nueva importación

const app = express();
const PORT = process.env.PORT || 3001;

// Verificar conexión a la base de datos al iniciar
testConnection().then(success => {
  if (!success) {
    console.error('No se pudo conectar a la base de datos. Saliendo...');
    process.exit(1);
  }
});

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check mejorado
app.get('/api/health', async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    await testConnection();
    res.json({ 
      status: 'OK', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString() 
    });
  }
});

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error global:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
});