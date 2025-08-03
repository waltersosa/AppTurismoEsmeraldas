import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

// Configuración de conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authDB';

// Datos del usuario administrador por defecto
const adminUser = {
  nombre: 'Administrador',
  correo: 'admin@esmeraldas.gob.ec',
  contraseña: 'admin123',
  rol: 'admin',
  activo: true
};

async function createAdminUser() {
  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conexión exitosa a MongoDB');

    // Verificar si ya existe un usuario admin
    const existingAdmin = await User.findOne({ 
      correo: adminUser.correo,
      rol: 'admin'
    });

    if (existingAdmin) {
      console.log('⚠️  El usuario administrador ya existe');
      console.log(`📧 Email: ${existingAdmin.correo}`);
      console.log(`👤 Nombre: ${existingAdmin.nombre}`);
      console.log(`🔑 Rol: ${existingAdmin.rol}`);
      return;
    }

    // Crear el usuario administrador
    console.log('👤 Creando usuario administrador...');
    const newAdmin = new User(adminUser);
    await newAdmin.save();

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📋 Detalles del usuario:');
    console.log(`   📧 Email: ${adminUser.correo}`);
    console.log(`   🔑 Contraseña: ${adminUser.contraseña}`);
    console.log(`   👤 Nombre: ${adminUser.nombre}`);
    console.log(`   🔑 Rol: ${adminUser.rol}`);
    console.log('');
    console.log('🚀 Credenciales para acceder al BackOffice:');
    console.log(`   Email: ${adminUser.correo}`);
    console.log(`   Contraseña: ${adminUser.contraseña}`);

  } catch (error) {
    console.error('❌ Error al crear usuario administrador:', error.message);
    if (error.code === 11000) {
      console.log('⚠️  El correo ya está registrado');
    }
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el script
createAdminUser()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 