import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String },
  coverImageUrl: { type: String }, // URL directa para imagen de portada
  imageUrls: [{ type: String }], // URLs directas para imágenes de galería
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Place', placeSchema); 