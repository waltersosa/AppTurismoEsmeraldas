import mongoose from 'mongoose';
import './Place.js';
import './User.js';

const reviewSchema = new mongoose.Schema({
  lugarId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Place', 
    required: true 
  },
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  comentario: { 
    type: String, 
    required: true 
  },
  calificacion: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  estado: { 
    type: String, 
    enum: ['aprobada', 'bloqueada'], 
    default: 'aprobada' 
  }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema); 