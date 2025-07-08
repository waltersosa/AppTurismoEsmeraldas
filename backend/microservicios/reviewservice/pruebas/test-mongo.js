import mongoose from 'mongoose';
import Review from '../models/Review.js';

await mongoose.connect('mongodb://localhost:27017/reviewsDB');

const review = await Review.create({
  lugarId: new mongoose.Types.ObjectId('686c8be3ed3abb2a5338a912'),
  usuarioId: new mongoose.Types.ObjectId('686b2b7c3b2cbbeacecc6ed3'),
  comentario: 'Test directo',
  calificacion: 4
});
console.log('Review guardada:', review);
process.exit();
