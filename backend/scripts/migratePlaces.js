import mongoose from 'mongoose';
import Place from '../models/Place.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/turismoDB');
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Función para migrar lugares
const migratePlaces = async () => {
  try {
    console.log('🔄 Iniciando migración de lugares...');
    
    // Obtener todos los lugares
    const places = await Place.find({});
    console.log(`📊 Encontrados ${places.length} lugares para migrar`);
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const place of places) {
      try {
        // Verificar si el lugar tiene imágenes en formato string
        if (place.images && place.images.length > 0) {
          const hasStringImages = place.images.some(img => typeof img === 'string');
          
          if (hasStringImages) {
            console.log(`🔄 Migrando lugar: ${place.name} (ID: ${place._id})`);
            
            // Limpiar el campo images (lo dejamos vacío para que se llene con las nuevas imágenes)
            await Place.findByIdAndUpdate(place._id, {
              $set: { 
                images: [],
                coverImage: null
              }
            });
            
            console.log(`✅ Lugar migrado: ${place.name}`);
            migratedCount++;
          } else {
            console.log(`⏭️ Lugar ya migrado: ${place.name}`);
          }
        } else {
          console.log(`⏭️ Lugar sin imágenes: ${place.name}`);
        }
      } catch (error) {
        console.error(`❌ Error migrando lugar ${place.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📈 Resumen de migración:');
    console.log(`✅ Lugares migrados: ${migratedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📊 Total procesados: ${places.length}`);
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
  }
};

// Función principal
const main = async () => {
  try {
    await connectDB();
    await migratePlaces();
    console.log('\n🎉 Migración completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
};

// Ejecutar migración
main(); 