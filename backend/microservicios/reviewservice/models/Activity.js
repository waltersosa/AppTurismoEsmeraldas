import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombreUsuario: {
    type: String,
    required: true
  },
  accion: {
    type: String,
    required: true
  },
  recurso: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Activity', activitySchema); 