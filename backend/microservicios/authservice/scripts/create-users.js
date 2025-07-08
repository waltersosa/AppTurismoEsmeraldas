import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import config from '../config/config.js';

const MONGO_URI = config.mongoUri || 'mongodb://localhost:27017/authDB'; // Ajusta según tu config

const users = [
  { nombre: 'Ana Torres', email: 'ana.torres@email.com', password: 'Ana12345', rol: 'usuario' },
  { nombre: 'Carlos Vera', email: 'carlos.vera@email.com', password: 'Carlos123', rol: 'usuario' },
  { nombre: 'María López', email: 'maria.lopez@email.com', password: 'Maria1234', rol: 'usuario' },
  { nombre: 'Pedro Gómez', email: 'pedro.gomez@email.com', password: 'Pedro1234', rol: 'usuario' },
  { nombre: 'Lucía Pérez', email: 'lucia.perez@email.com', password: 'Lucia1234', rol: 'usuario' },
  { nombre: 'Jorge Ruiz', email: 'jorge.ruiz@email.com', password: 'Jorge1234', rol: 'usuario' },
  { nombre: 'Sofía Castro', email: 'sofia.castro@email.com', password: 'Sofia1234', rol: 'usuario' },
  { nombre: 'Gabriel Díaz', email: 'gabriel.diaz@email.com', password: 'Gabriel12', rol: 'usuario' },
  { nombre: 'Elena Ríos', email: 'elena.rios@email.com', password: 'Elena1234', rol: 'usuario' },
  { nombre: 'Admin GAD', email: 'admin.gad@email.com', password: 'Admin1234', rol: 'gad' },
  // Usuarios propietarios
  { nombre: 'Patricia Herrera', email: 'patricia.herrera@email.com', password: 'Patricia1', rol: 'propietario' },
  { nombre: 'Miguel Salas', email: 'miguel.salas@email.com', password: 'Miguel123', rol: 'propietario' },
  { nombre: 'Verónica León', email: 'veronica.leon@email.com', password: 'Veronica1', rol: 'propietario' },
  { nombre: 'Esteban Bravo', email: 'esteban.bravo@email.com', password: 'Esteban12', rol: 'propietario' },
  { nombre: 'Carmen Paredes', email: 'carmen.paredes@email.com', password: 'Carmen123', rol: 'propietario' }
];

async function createUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`⚠️  Usuario ya existe: ${u.email}`);
        continue;
      }
      const hash = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hash });
      console.log(`✅ Usuario creado: ${u.email}`);
    }
    await mongoose.disconnect();
    console.log('✔️  Proceso finalizado.');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

createUsers(); 