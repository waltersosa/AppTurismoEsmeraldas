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
import notificationsRoutes from './routes/notifications.js'

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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
app.use('/notifications', notificationsRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Esmeraldas Turismo - Backend Unificado',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/auth',
      places: '/places',
      reviews: '/reviews',
      notifications: '/notifications',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funcionando correctamente',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Health check simple
app.get('/health/simple', (req, res) => {
  res.json({
    status: 'healthy',
    online: 1,
    total: 1,
    timestamp: new Date().toISOString(),
    services: [
      {
        name: 'Backend Unificado',
        status: 'online',
        port: 3001
      }
    ]
  });
});

// Stats overview
app.get('/stats/overview', async (req, res) => {
  try {
    // Importar los modelos necesarios
    const User = (await import('./models/User.js')).default;
    const Place = (await import('./models/Place.js')).default;
    const Review = (await import('./models/Review.js')).default;

    // Obtener conteos
    const usuarios = await User.countDocuments();
    const lugares = await Place.countDocuments();
    const resenas = await Review.countDocuments();

    res.json({
      usuarios,
      lugares,
      resenas,
      imagenes: 0 // Ya no tenemos módulo de imágenes
    });
  } catch (error) {
    console.error('Error getting stats overview:', error);
    res.status(500).json({
      usuarios: 0,
      lugares: 0,
      resenas: 0,
      imagenes: 0
    });
  }
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