import express from 'express';
import connectAuthDB from './config/db.js';
import config from './config/config.js';
import router from './routes/routes.js';

const app = express();
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
        login: '/auth/login'
      }
    }
  });
});

// Usar el router para todas las rutas de autenticación
app.use(router);

// Conectar a la base de datos y arrancar el servidor
const start = async () => {
  await connectAuthDB();
  app.listen(config.port, () => {
    console.log(`🚀 AuthService corriendo en http://localhost:${config.port}`);
  });
};

start(); 