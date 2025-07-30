import express from 'express';
import cors from 'cors';
import connectPlacesDB from './config/db.js';
import config from './config/config.js';
import router from './routes/routes.js';
import path from 'path';

const app = express();

// Configuración CORS
app.use(cors({
  origin: [
    'http://localhost:4300', // BackOffice Angular
    'http://localhost:4200', // Frontend principal (app móvil)
    'http://127.0.0.1:4300',
    'http://127.0.0.1:4200'
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
    message: 'PlacesService - Microservicio de Lugares Turísticos',
    data: {
      service: 'PlacesService',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString(),
      endpoints: {
        places: '/places',
        placesCount: '/places/count',
        activities: '/places/admin/activities'
      }
    }
  });
});

app.use('/places', router);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en PlacesService:', err);
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
    await connectPlacesDB();
    app.listen(config.port, () => {
      console.log(`🚀 PlacesService corriendo en http://localhost:${config.port}`);
      console.log(`📝 Endpoints disponibles:`);
      console.log(`   - GET /places`);
      console.log(`   - POST /places`);
      console.log(`   - PUT /places/:id`);
      console.log(`   - DELETE /places/:id`);
      console.log(`   - GET /places/count`);
    });
  } catch (error) {
    console.error('❌ Error iniciando PlacesService:', error);
    process.exit(1);
  }
};

start(); 