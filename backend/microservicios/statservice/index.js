import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/config.js';
import statsRoutes from './routes/stats.js';
import healthRoutes from './routes/health.js';
import serviceRoutes from './routes/service.js';

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 1000, // 1000 requests por minuto
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intenta de nuevo más tarde'
  }
});
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check principal
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Stats Microservice - Esmeraldas Turismo',
    data: {
      service: 'Stats Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'running',
      port: config.port,
      endpoints: {
        stats: '/stats/overview',
        health: '/health',
        healthSimple: '/health/simple',
        healthService: '/health/:serviceName',
        services: '/service',
        serviceControl: '/service/:serviceName/:action',
        serviceStatus: '/service/:serviceName/status'
      }
    }
  });
});

// Rutas de estadísticas
app.use('/stats', statsRoutes);

// Rutas de health check
app.use('/health', healthRoutes);

// Rutas de control de servicios
app.use('/service', serviceRoutes);

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
      console.log(`🚀 Stats Microservice corriendo en puerto ${config.port}`);
      console.log(`📊 Health check: http://localhost:${config.port}/`);
      console.log(`📝 API Stats: http://localhost:${config.port}/stats/overview`);
      console.log(`🏥 Health Check Services: http://localhost:${config.port}/health`);
      console.log(`🔍 Health Simple: http://localhost:${config.port}/health/simple`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

start(); 