import mongoose from 'mongoose';
import Place from '../models/Place.js';

// Configuración de conexión
const MONGODB_URI = 'mongodb://localhost:27017/places_db';

async function migrateOwnerId() {
  console.log('🔄 Iniciando migración de ownerId para lugares existentes...\n');

  try {
    // Conectar a la base de datos
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar lugares sin ownerId
    const placesWithoutOwnerId = await Place.find({ ownerId: { $exists: false } });
    console.log(`📊 Encontrados ${placesWithoutOwnerId.length} lugares sin ownerId`);

    if (placesWithoutOwnerId.length === 0) {
      console.log('✅ Todos los lugares ya tienen ownerId asignado');
      return;
    }

    // ID por defecto para lugares existentes (puedes cambiarlo por un ID real)
    const defaultOwnerId = new mongoose.Types.ObjectId('64f8a1b2c3d4e5f6a7b8c9d1');

    console.log(`🔄 Asignando ownerId por defecto: ${defaultOwnerId}`);

    // Actualizar lugares sin ownerId
    const updateResult = await Place.updateMany(
      { ownerId: { $exists: false } },
      { 
        $set: { 
          ownerId: defaultOwnerId,
          updatedAt: new Date()
        } 
      }
    );

    console.log(`✅ Migración completada:`);
    console.log(`   - Lugares actualizados: ${updateResult.modifiedCount}`);
    console.log(`   - Total de lugares en la base de datos: ${await Place.countDocuments()}`);

    // Verificar que todos los lugares ahora tienen ownerId
    const placesWithOwnerId = await Place.find({ ownerId: { $exists: true } });
    console.log(`   - Lugares con ownerId: ${placesWithOwnerId.length}`);

    if (placesWithOwnerId.length === await Place.countDocuments()) {
      console.log('✅ Migración exitosa: Todos los lugares tienen ownerId');
    } else {
      console.log('⚠️  Advertencia: Algunos lugares aún no tienen ownerId');
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
  } finally {
    // Cerrar conexión
    await mongoose.disconnect();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
}

// Ejecutar migración
migrateOwnerId(); 