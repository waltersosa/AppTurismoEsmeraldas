import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, default: 'usuario' },
  activo: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

export default User; 