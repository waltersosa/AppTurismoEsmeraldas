import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/mongo.js';
import config from './config/config.js';
import reviewRoutes from './routes/review.js';

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares de seguridad
app.use(helmet());

// Configuración CORS mejorada
app.use(cors({
  origin: [
    'http://localhost:4200', // BackOffice Angular
    'http://localhost:3000', // Frontend principal (si existe)
    'http://127.0.0.1:4200',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ]
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
});
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check principal
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Reviews Microservice - Esmeraldas Turismo',
    data: {
      service: 'Reviews Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'running',
      port: config.port,
      endpoints: {
        reviews: '/reviews',
        reviewsCount: '/reviews/count'
      }
    }
  });
});

// Rutas
app.use('/reviews', reviewRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Función para iniciar el servidor
const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`🚀 Reviews Microservice corriendo en puerto ${config.port}`);
      console.log(`📊 Health check: http://localhost:${config.port}/`);
      console.log(`📝 API Reviews: http://localhost:${config.port}/reviews`);
      console.log(`📊 Reviews Count: http://localhost:${config.port}/reviews/count`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

start(); 