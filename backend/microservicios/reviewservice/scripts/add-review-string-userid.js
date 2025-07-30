import mongoose from 'mongoose';
import Review from '../models/Review.js';
import config from '../config/config.js';

async function main() {
  await mongoose.connect(config.mongoUri || 'mongodb://localhost:27017/reviewsDB');
  const review = await Review.create({
    lugarId: '686c8be3ed3abb2a5338a8fa',
    usuarioId: '686af11930c2973637585533',
    comentario: 'Test con usuarioId string',
    calificacion: 4
  });
  console.log('Reseña creada:', review);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error al crear reseña:', err);
  process.exit(1);
}); 