import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  nombreUsuario: { type: String, required: true },
  accion: { type: String, required: true },
  recurso: { type: String },
  fecha: { type: Date, default: Date.now }
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity; 