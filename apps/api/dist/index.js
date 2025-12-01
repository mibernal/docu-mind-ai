import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// Import routes from modules
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
        timestamp: new Date().toISOString()
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Error handler
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
});
export default app;
