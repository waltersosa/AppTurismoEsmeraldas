import mongoose from 'mongoose';
import Review from '../models/Review.js';
import User from '../models/User.js';
import config from '../config/config.js';

async function main() {
  await mongoose.connect(config.mongoUri || 'mongodb://localhost:27017/reviewsDB');
  const reviews = await Review.find();
  let missing = 0;
  for (const review of reviews) {
    const user = await User.findById(review.usuarioId);
    if (!user) {
      console.log(`Usuario NO encontrado para review ${review._id} (usuarioId: ${review.usuarioId})`);
      missing++;
    } else if (!user.nombre) {
      console.log(`Usuario SIN nombre para review ${review._id} (usuarioId: ${review.usuarioId})`);
      missing++;
    }
  }
  if (missing === 0) {
    console.log('Todos los usuarioId de las reseñas existen y tienen nombre.');
  } else {
    console.log(`Total de usuarioId faltantes o sin nombre: ${missing}`);
  }
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error al validar usuarios en reseñas:', err);
  process.exit(1);
}); 