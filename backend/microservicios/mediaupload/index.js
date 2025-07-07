import express from 'express';
import cors from 'cors';
import connectMediaDB from './config/db.js';
import config from './config/config.js';
import router from './routes/routes.js';
import path from 'path';

const app = express();

// Configuración CORS
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

app.use(express.json());

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.resolve('uploads')));

// Ruta raíz - Estado del servicio
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MediaUploadService - Microservicio de Subida de Archivos',
    data: {
      service: 'MediaUploadService',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString(),
      endpoints: {
        upload: '/media/upload',
        get: '/media/:id',
        delete: '/media/:id',
        count: '/media/count'
      }
    }
  });
});

app.use(router);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en MediaUploadService:', err);
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

const start = async () => {
  try {
    await connectMediaDB();
    app.listen(config.port, () => {
      console.log(`🚀 MediaUploadService corriendo en http://localhost:${config.port}`);
      console.log(`📝 Endpoints disponibles:`);
      console.log(`   - POST /media/upload`);
      console.log(`   - GET /media/:id`);
      console.log(`   - DELETE /media/:id`);
      console.log(`   - GET /media/count`);
    });
  } catch (error) {
    console.error('❌ Error iniciando MediaUploadService:', error);
    process.exit(1);
  }
};

start(); 