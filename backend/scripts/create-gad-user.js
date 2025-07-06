import mongoose from 'mongoose';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/turismo-esmeraldas';

async function createOrUpdateGadUser() {
  await mongoose.connect(MONGO_URI);
  const correo = 'gad@esmeraldas.com';
  const contraseña = 'Gad2024!';
  const nombre = 'Administrador GAD';
  const rol = 'gad';

  let user = await User.findOne({ correo });
  if (user) {
    user.contraseña = contraseña;
    user.rol = rol;
    user.nombre = nombre;
    user.activo = true;
    await user.save();
    console.log('Usuario GAD actualizado:', correo);
  } else {
    user = new User({ correo, contraseña, nombre, rol, activo: true });
    await user.save();
    console.log('Usuario GAD creado:', correo);
  }
  await mongoose.disconnect();
}

createOrUpdateGadUser().catch(err => {
  console.error('Error creando/actualizando usuario GAD:', err);
  process.exit(1);
}); 