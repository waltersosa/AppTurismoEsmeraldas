import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { connectDB } from './db/connection.js';
import authRoutes from './routes/auth.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { connectMongo } from './config/mongo.js';
import placeRoutes from './routes/place.js';
import { validatePlace } from './middlewares/placeValidation.js';
import reviewRoutes from './routes/review.js';
import mediaRoutes from './routes/media.js';
import statsRoutes from './routes/stats.js';

// Crear aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();
connectMongo();

// Middlewares básicos
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuración CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas
app.use('/auth', authRoutes);
app.use('/places', placeRoutes);
app.use('/reviews', reviewRoutes);
app.use('/media', mediaRoutes);
app.use('/stats', statsRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Esmeraldas Turismo - Auth Service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/auth',
      health: '/auth/health',
      register: '/auth/register',
      login: '/auth/login',
      validate: '/auth/validate'
    }
  });
});

// Middleware para rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 Auth Service iniciado en puerto ${PORT}`);
  console.log(`📊 Entorno: ${config.server.nodeEnv}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📝 Documentación: http://localhost:${PORT}/`);
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Excepción no capturada:', err);
  process.exit(1);
}); 