import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Place from '../models/Place.js';
import User from '../models/User.js';
import { config } from '../config/config.js';

// Conectar a MongoDB
await mongoose.connect(config.database.uri);

const sampleReviews = [
  {
    comentario: 'Excelente lugar para visitar con la familia. Las playas son hermosas y el ambiente es muy relajante. Definitivamente volveré.',
    calificacion: 5,
    estado: 'aprobada'
  },
  {
    comentario: 'Muy bonito lugar, perfecto para pasar un día tranquilo. La vista al mar es espectacular.',
    calificacion: 4,
    estado: 'aprobada'
  },
  {
    comentario: 'Lugar agradable pero podría mejorar en algunos aspectos. El acceso está bien.',
    calificacion: 3,
    estado: 'aprobada'
  },
  {
    comentario: 'Increíble experiencia. El río es perfecto para la pesca y la navegación. Recomendado para los amantes de la naturaleza.',
    calificacion: 5,
    estado: 'aprobada'
  },
  {
    comentario: 'Hermoso lugar natural. Ideal para hacer senderismo y observar la biodiversidad local.',
    calificacion: 4,
    estado: 'aprobada'
  },
  {
    comentario: 'Cascada impresionante con aguas cristalinas. Perfecta para refrescarse en un día caluroso.',
    calificacion: 5,
    estado: 'aprobada'
  },
  {
    comentario: 'Vista panorámica espectacular de la ciudad. Perfecto para tomar fotografías al atardecer.',
    calificacion: 4,
    estado: 'aprobada'
  },
  {
    comentario: 'Parque muy bien mantenido con áreas verdes hermosas. Ideal para actividades familiares.',
    calificacion: 4,
    estado: 'aprobada'
  }
];

try {
  // Obtener lugares y usuarios existentes
  const places = await Place.find().limit(8);
  const users = await User.find().limit(4);

  if (places.length === 0) {
    console.log('No hay lugares en la base de datos. Ejecuta primero el script de lugares.');
    process.exit(1);
  }

  if (users.length === 0) {
    console.log('No hay usuarios en la base de datos. Crea algunos usuarios primero.');
    process.exit(1);
  }

  // Limpiar reseñas existentes
  await Review.deleteMany({});
  console.log('Reseñas existentes eliminadas');

  // Crear reseñas de ejemplo
  const reviews = [];
  for (let i = 0; i < sampleReviews.length; i++) {
    const reviewData = {
      ...sampleReviews[i],
      lugarId: places[i % places.length]._id,
      usuarioId: users[i % users.length]._id
    };
    reviews.push(reviewData);
  }

  const createdReviews = await Review.insertMany(reviews);
  console.log(`${createdReviews.length} reseñas de ejemplo agregadas exitosamente`);

  // Mostrar las reseñas creadas
  for (const review of createdReviews) {
    const place = await Place.findById(review.lugarId);
    const user = await User.findById(review.usuarioId);
    console.log(`- ${user?.nombre || 'Usuario'} reseñó "${place?.name}" con ${review.calificacion} estrellas`);
  }

} catch (error) {
  console.error('Error al agregar reseñas de ejemplo:', error);
} finally {
  // Cerrar conexión
  await mongoose.connection.close();
  console.log('Conexión a MongoDB cerrada');
} 