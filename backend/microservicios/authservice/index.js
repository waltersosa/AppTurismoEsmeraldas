import express from 'express';
import cors from 'cors';
import connectAuthDB from './config/db.js';
import config from './config/config.js';
import router from './routes/routes.js';

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

// Ruta raíz - Estado del servicio
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AuthService - Microservicio de Autenticación',
    data: {
      service: 'AuthService',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/auth/health',
        register: '/auth/register',
        login: '/auth/login',
        users: '/auth/users',
        usersCount: '/auth/users/count'
      }
    }
  });
});

// Usar el router para todas las rutas de autenticación
app.use(router);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en AuthService:', err);
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

// Conectar a la base de datos y arrancar el servidor
const start = async () => {
  try {
    await connectAuthDB();
    app.listen(config.port, () => {
      console.log(`🚀 AuthService corriendo en http://localhost:${config.port}`);
      console.log(`📝 Endpoints disponibles:`);
      console.log(`   - POST /auth/login`);
      console.log(`   - POST /auth/register`);
      console.log(`   - GET /auth/users`);
      console.log(`   - GET /auth/users/count`);
    });
  } catch (error) {
    console.error('❌ Error iniciando AuthService:', error);
    process.exit(1);
  }
};

start(); 