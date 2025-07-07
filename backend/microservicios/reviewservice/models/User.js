import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  rol: { type: String, required: true },
  // Puedes agregar más campos según lo que uses en populate o en las reseñas
});

const User = mongoose.model('User', userSchema);

export default User; 