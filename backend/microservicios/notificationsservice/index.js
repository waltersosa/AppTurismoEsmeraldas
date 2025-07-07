import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import config from './config/config.js';
import notificationRoutes from './routes/notifications.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Conectar a MongoDB
mongoose.connect(config.mongoUri)
  .then(() => console.log('✅ Conectado a la base de datos notificationsDB'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });

// Middlewares de seguridad
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check principal
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Notifications Microservice - Esmeraldas Turismo',
    data: {
      service: 'Notifications Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'running',
      port: config.port
    }
  });
});

// Rutas de notificaciones
app.use('/notifications', notificationRoutes);

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

// Iniciar servidor
const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`🚀 Notifications Microservice corriendo en puerto ${config.port}`);
      console.log(`📊 Health check: http://localhost:${config.port}/`);
      console.log(`📝 API Notifications: http://localhost:${config.port}/notifications`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

start(); 