import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { connectDB } from './db/connection.js';
import authRoutes from './routes/auth.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import placeRoutes from './routes/place.js';
import { validatePlace } from './middlewares/placeValidation.js';
import reviewRoutes from './routes/review.js';
import notificationsRoutes from './routes/notifications.js'
import activityRoutes from './routes/activity.js'
import User from './models/User.js';

// Crear aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Función para crear usuario admin por defecto
async function createDefaultAdmin() {
  try {
    const adminUser = {
      nombre: 'Administrador',
      correo: 'admin@esmeraldas.gob.ec',
      contraseña: 'admin123',
      rol: 'admin',
      activo: true
    };

    // Verificar si ya existe un usuario admin
    const existingAdmin = await User.findOne({ 
      correo: adminUser.correo,
      rol: 'admin'
    });

    if (!existingAdmin) {
      console.log('👤 Creando usuario administrador por defecto...');
      const newAdmin = new User(adminUser);
      await newAdmin.save();
      console.log('✅ Usuario administrador creado exitosamente');
      console.log('📋 Credenciales del BackOffice:');
      console.log(`   📧 Email: ${adminUser.correo}`);
      console.log(`   🔑 Contraseña: ${adminUser.contraseña}`);
    } else {
      console.log('✅ Usuario administrador ya existe');
    }
  } catch (error) {
    console.error('❌ Error al crear usuario admin:', error.message);
  }
}

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
app.use('/notifications', notificationsRoutes);
app.use('/activities', activityRoutes);

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
app.listen(PORT, async () => {
  console.log(`🚀 Auth Service iniciado en puerto ${PORT}`);
  console.log(`📊 Entorno: ${config.server.nodeEnv}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📝 Documentación: http://localhost:${PORT}/`);
  
  // Crear usuario admin después de iniciar el servidor
  await createDefaultAdmin();
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