import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: false },
  type: { 
    type: String, 
    enum: ['cover', 'gallery'], 
    default: 'gallery' 
  },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Media', mediaSchema); 