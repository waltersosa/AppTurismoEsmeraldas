import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String },
  coverImage: { 
    type: mongoose.Schema.Types.Mixed, // Puede ser ObjectId o String (URL)
    ref: 'Media'
  },
  coverImageUrl: { type: String }, // URL directa para imagen de portada
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
  imageUrls: [{ type: String }], // URLs directas para imágenes
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Place', placeSchema); 