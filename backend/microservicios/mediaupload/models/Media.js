import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', default: null },
  type: { type: String, enum: ['cover', 'gallery'], default: 'gallery' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Media', mediaSchema); 