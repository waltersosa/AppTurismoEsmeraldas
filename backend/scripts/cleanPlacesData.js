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

// Función para limpiar datos de lugares
const cleanPlacesData = async () => {
  try {
    console.log('🔄 Iniciando limpieza de datos de lugares...');
    
    // Obtener todos los lugares
    const places = await Place.find({});
    console.log(`📊 Encontrados ${places.length} lugares para revisar`);
    
    let cleanedCount = 0;
    let errorCount = 0;
    
    for (const place of places) {
      try {
        let needsUpdate = false;
        const updateData = {};
        
        // Limpiar campo images si contiene URLs
        if (place.images && Array.isArray(place.images)) {
          const urlImages = [];
          const objectIdImages = [];
          
          place.images.forEach(item => {
            if (typeof item === 'string') {
              if (item.startsWith('http://') || item.startsWith('https://')) {
                // Es una URL, mover a imageUrls
                urlImages.push(item);
              } else if (item.match(/^[0-9a-fA-F]{24}$/)) {
                // Es un ObjectId válido, mantener
                objectIdImages.push(item);
              }
              // Si no es ni URL ni ObjectId válido, ignorarlo
            }
          });
          
          if (urlImages.length > 0) {
            updateData.imageUrls = urlImages;
            needsUpdate = true;
          }
          
          if (objectIdImages.length > 0) {
            updateData.images = objectIdImages;
            needsUpdate = true;
          } else {
            updateData.images = [];
            needsUpdate = true;
          }
        }
        
        // Limpiar campo coverImage si es una URL
        if (place.coverImage && typeof place.coverImage === 'string') {
          if (place.coverImage.startsWith('http://') || place.coverImage.startsWith('https://')) {
            // Es una URL, mover a coverImageUrl
            updateData.coverImageUrl = place.coverImage;
            updateData.coverImage = null;
            needsUpdate = true;
          } else if (!place.coverImage.match(/^[0-9a-fA-F]{24}$/)) {
            // No es un ObjectId válido, limpiarlo
            updateData.coverImage = null;
            needsUpdate = true;
          }
        }
        
        // Aplicar actualizaciones si es necesario
        if (needsUpdate) {
          console.log(`🔄 Limpiando lugar: ${place.name} (ID: ${place._id})`);
          
          await Place.findByIdAndUpdate(place._id, updateData);
          
          console.log(`✅ Lugar limpiado: ${place.name}`);
          cleanedCount++;
        } else {
          console.log(`⏭️ Lugar ya limpio: ${place.name}`);
        }
        
      } catch (error) {
        console.error(`❌ Error limpiando lugar ${place.name}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📈 Resumen de limpieza:');
    console.log(`✅ Lugares limpiados: ${cleanedCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📊 Total procesados: ${places.length}`);
    
  } catch (error) {
    console.error('❌ Error en limpieza:', error);
  }
};

// Función principal
const main = async () => {
  try {
    await connectDB();
    await cleanPlacesData();
    console.log('\n🎉 Limpieza completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en limpieza:', error);
    process.exit(1);
  }
};

// Ejecutar limpieza
main(); 