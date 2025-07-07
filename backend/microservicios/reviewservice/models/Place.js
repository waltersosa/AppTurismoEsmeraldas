import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Puedes agregar más campos según lo que uses en populate o en las reseñas
});

const Place = mongoose.model('Place', placeSchema);

export default Place; 