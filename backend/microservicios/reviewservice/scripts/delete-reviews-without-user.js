import mongoose from 'mongoose';
import Review from '../models/Review.js';
import config from '../config/config.js';

async function main() {
  await mongoose.connect(config.mongoUri || 'mongodb://localhost:27017/reviewsDB');
  const result = await Review.deleteMany({ $or: [ { usuarioId: null }, { usuarioId: { $exists: false } } ] });
  console.log(`Reseñas eliminadas: ${result.deletedCount}`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error al eliminar reseñas sin usuarioId:', err);
  process.exit(1);
}); 