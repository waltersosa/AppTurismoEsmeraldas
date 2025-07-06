import mongoose from 'mongoose';
import Service from '../models/Service.js';
import { config } from '../config/config.js';

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo.uri);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Servicios por defecto
const serviciosPorDefecto = [
  {
    nombre: 'API Principal',
    descripcion: 'Servicio principal de la API de Turismo Esmeraldas',
    endpoint: `http://localhost:${config.server.port}/auth/health`,
    tipo: 'api',
    version: '1.0.0',
    activo: true,
    estado: 'online',
    estadoReal: 'running',
    puerto: config.server.port,
    procesoId: `proc_${Date.now()}_api`
  },
  {
    nombre: 'Base de Datos MongoDB',
    descripcion: 'Servicio de base de datos MongoDB',
    endpoint: 'mongodb://localhost:27017',
    tipo: 'database',
    version: '6.0+',
    activo: true,
    estado: 'online',
    estadoReal: 'running',
    puerto: 27017,
    procesoId: `proc_${Date.now()}_mongo`
  },
  {
    nombre: 'Servicio de Autenticación',
    descripcion: 'Microservicio de autenticación y gestión de usuarios',
    endpoint: `http://localhost:${config.server.port}/auth/health`,
    tipo: 'api',
    version: '1.0.0',
    activo: true,
    estado: 'online',
    estadoReal: 'running',
    puerto: config.server.port,
    procesoId: `proc_${Date.now()}_auth`
  },
  {
    nombre: 'Servicio de Lugares',
    descripcion: 'Microservicio de gestión de lugares turísticos',
    endpoint: `http://localhost:${config.server.port}/places`,
    tipo: 'api',
    version: '1.0.0',
    activo: true,
    estado: 'online',
    estadoReal: 'running',
    puerto: config.server.port,
    procesoId: `proc_${Date.now()}_places`
  },
  {
    nombre: 'Servicio de Reseñas',
    descripcion: 'Microservicio de gestión de reseñas y calificaciones',
    endpoint: `http://localhost:${config.server.port}/reviews`,
    tipo: 'api',
    version: '1.0.0',
    activo: true,
    estado: 'online',
    estadoReal: 'running',
    puerto: config.server.port,
    procesoId: `proc_${Date.now()}_reviews`
  },
  {
    nombre: 'Servicio de Multimedia',
    descripcion: 'Microservicio de gestión de archivos multimedia',
    endpoint: `http://localhost:${config.server.port}/media`,
    tipo: 'api',
    version: '1.0.0',
    activo: true,
    estado: 'online',
    estadoReal: 'running',
    puerto: config.server.port,
    procesoId: `proc_${Date.now()}_media`
  },
  {
    nombre: 'Servicio de Estadísticas',
    descripcion: 'Microservicio de estadísticas y métricas',
    endpoint: `http://localhost:${config.server.port}/stats`,
    tipo: 'api',
    version: '1.0.0',
    activo: true,
    estado: 'online',
    estadoReal: 'running',
    puerto: config.server.port,
    procesoId: `proc_${Date.now()}_stats`
  },
  {
    nombre: 'Frontend Angular',
    descripcion: 'Aplicación frontend desarrollada en Angular',
    endpoint: 'http://localhost:4200',
    tipo: 'external',
    version: '1.0.0',
    activo: true,
    estado: 'online',
    estadoReal: 'running',
    puerto: 4200,
    procesoId: `proc_${Date.now()}_frontend`
  }
];

// Función para inicializar servicios
const inicializarServicios = async () => {
  try {
    console.log('🚀 Inicializando servicios por defecto...');
    
    for (const servicioData of serviciosPorDefecto) {
      // Verificar si el servicio ya existe
      const servicioExistente = await Service.findOne({ nombre: servicioData.nombre });
      
      if (servicioExistente) {
        console.log(`⚠️  Servicio "${servicioData.nombre}" ya existe, actualizando...`);
        await Service.findByIdAndUpdate(servicioExistente._id, servicioData, { new: true });
      } else {
        console.log(`✅ Creando servicio: ${servicioData.nombre}`);
        const nuevoServicio = new Service(servicioData);
        await nuevoServicio.save();
      }
    }
    
    console.log('✅ Servicios inicializados correctamente');
    
    // Mostrar resumen
    const totalServicios = await Service.countDocuments();
    const serviciosActivos = await Service.countDocuments({ activo: true });
    
    console.log(`📊 Resumen:`);
    console.log(`   - Total de servicios: ${totalServicios}`);
    console.log(`   - Servicios activos: ${serviciosActivos}`);
    console.log(`   - Servicios inactivos: ${totalServicios - serviciosActivos}`);
    
  } catch (error) {
    console.error('❌ Error inicializando servicios:', error);
  }
};

// Función principal
const main = async () => {
  await connectDB();
  await inicializarServicios();
  
  console.log('🎉 Inicialización completada');
  process.exit(0);
};

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { inicializarServicios }; 