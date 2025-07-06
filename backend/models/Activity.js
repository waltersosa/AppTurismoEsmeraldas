import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombreUsuario: { type: String, required: true },
  accion: { type: String, required: true },
  recurso: { type: String },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model('Activity', activitySchema); 