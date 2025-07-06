import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Place from '../models/Place.js';
import Review from '../models/Review.js';
import Media from '../models/Media.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/turismoDB';

const nombres = [
  'Juan', 'Maria', 'Pedro', 'Ana', 'Luis', 'Sofia', 'Carlos', 'Lucia', 'Miguel', 'Valentina'
];
const nombresOriginales = [
  'Juan', 'María', 'Pedro', 'Ana', 'Luis', 'Sofía', 'Carlos', 'Lucía', 'Miguel', 'Valentina'
];
const lugaresEjemplo = [
  { name: 'Playa Escondida', description: 'Hermosa playa de arena blanca.', location: 'Esmeraldas', category: 'Playa' },
  { name: 'Cascada Verde', description: 'Cascada rodeada de naturaleza.', location: 'Muisne', category: 'Cascada' },
  { name: 'Isla Bonita', description: 'Isla paradisíaca.', location: 'Atacames', category: 'Isla' },
  { name: 'Bosque Encantado', description: 'Bosque con senderos mágicos.', location: 'Quinindé', category: 'Bosque' },
  { name: 'Laguna Azul', description: 'Laguna de aguas cristalinas.', location: 'Rioverde', category: 'Laguna' },
  { name: 'Mirador del Sol', description: 'Vista panorámica de la ciudad.', location: 'Esmeraldas', category: 'Mirador' },
  { name: 'Museo Cultural', description: 'Museo de historia local.', location: 'Esmeraldas', category: 'Museo' },
  { name: 'Parque Central', description: 'Parque para toda la familia.', location: 'Atacames', category: 'Parque' },
  { name: 'Reserva Natural', description: 'Área protegida de flora y fauna.', location: 'Muisne', category: 'Reserva' },
  { name: 'Malecón Turístico', description: 'Paseo junto al mar.', location: 'Esmeraldas', category: 'Malecón' }
];

const imagenesEjemplo = [
  'playa.jpg', 'cascada.jpg', 'isla.jpg', 'bosque.jpg', 'laguna.jpg',
  'mirador.jpg', 'museo.jpg', 'parque.jpg', 'reserva.jpg', 'malecon.jpg'
];

// Función para normalizar nombres (eliminar tildes y caracteres especiales, pero conservar letras)
function normalizar(str) {
  return str
    .normalize('NFD') // separa tildes
    .replace(/[\u0300-\u036f]/g, '') // elimina tildes
    .replace(/ñ/g, 'n') // reemplaza ñ
    .replace(/[^a-zA-Z0-9]/g, '') // elimina cualquier otro caracter especial
    .toLowerCase();
}

async function insertUniqueUser(nombre, baseCorreo, contraseña, intentos = 0) {
  let correo = intentos === 0 ? `${baseCorreo}@demo.com` : `${baseCorreo}${intentos}@demo.com`;
  try {
    const user = new User({ nombre, correo, contraseña, rol: 'usuario', activo: true });
    await user.save();
    return user;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.correo) {
      // Duplicado, intentar con otro correo
      return insertUniqueUser(nombre, baseCorreo, contraseña, intentos + 1);
    } else {
      throw error;
    }
  }
}

async function insertUniquePlace(baseName, data, intentos = 0) {
  let name = intentos === 0 ? baseName : `${baseName} ${intentos}`;
  try {
    const place = new Place({ ...data, name, active: true });
    await place.save();
    return place;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
      // Duplicado, intentar con otro nombre
      return insertUniquePlace(baseName, data, intentos + 1);
    } else {
      throw error;
    }
  }
}

async function insertUniqueMedia(baseFilename, data, intentos = 0) {
  let filename = intentos === 0 ? baseFilename : `${baseFilename.replace(/(\.[^.]+)$/, '')}_${intentos}$1`;
  try {
    const media = new Media({ ...data, filename });
    await media.save();
    return media;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.filename) {
      // Duplicado, intentar con otro filename
      return insertUniqueMedia(baseFilename, data, intentos + 1);
    } else {
      throw error;
    }
  }
}

async function insertUniqueReview(lugarId, usuarioId, comentario, calificacion, intentos = 0) {
  let comentarioFinal = intentos === 0 ? comentario : `${comentario} (${intentos})`;
  try {
    const review = new Review({ lugarId, usuarioId, comentario: comentarioFinal, calificacion, estado: 'aprobada' });
    await review.save();
    return review;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.comentario) {
      // Duplicado, intentar con otro comentario
      return insertUniqueReview(lugarId, usuarioId, comentario, calificacion, intentos + 1);
    } else {
      throw error;
    }
  }
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Borrar datos previos
    await User.deleteMany({});
    await Place.deleteMany({});
    await Review.deleteMany({});
    await Media.deleteMany({});
    console.log('Datos previos eliminados');

    // Crear usuarios normales
    const usuarios = [];
    for (let i = 0; i < 10; i++) {
      const nombre = nombresOriginales[i];
      const baseCorreo = normalizar(nombre);
      const contraseña = await bcrypt.hash('Hola123456', 12);
      const user = await insertUniqueUser(nombre, baseCorreo, contraseña);
      usuarios.push(user);
    }
    console.log('Usuarios creados');

    // Crear lugares
    const lugares = [];
    for (let i = 0; i < 10; i++) {
      const baseName = lugaresEjemplo[i].name;
      const place = await insertUniquePlace(baseName, lugaresEjemplo[i]);
      lugares.push(place);
    }
    console.log('Lugares creados');

    // Crear imágenes
    const imagenes = [];
    for (let i = 0; i < 10; i++) {
      const baseFilename = imagenesEjemplo[i];
      const media = await insertUniqueMedia(baseFilename, {
        originalName: imagenesEjemplo[i],
        url: `https://demo.com/img/${imagenesEjemplo[i]}`,
        placeId: lugares[i]._id,
        type: 'gallery',
        active: true
      });
      imagenes.push(media);
    }
    console.log('Imágenes creadas');

    // Crear reseñas
    for (let i = 0; i < 10; i++) {
      await insertUniqueReview(
        lugares[i]._id,
        usuarios[i]._id,
        `¡Excelente lugar para visitar! (${i+1})`,
        Math.floor(Math.random() * 5) + 1
      );
    }
    console.log('Reseñas creadas');

    // Crear usuario admin GAD si no existe
    const adminCorreo = 'gadadmin@demo.com';
    const adminExistente = await User.findOne({ correo: adminCorreo });
    if (!adminExistente) {
      const adminPass = await bcrypt.hash('Hola123456', 12);
      const admin = new User({ nombre: 'Administrador GAD', correo: adminCorreo, contraseña: adminPass, rol: 'gad', activo: true });
      await admin.save();
      console.log('Usuario admin GAD creado:', adminCorreo);
    } else {
      console.log('Usuario admin GAD ya existe:', adminCorreo);
    }

    console.log('¡Datos de ejemplo insertados correctamente!');
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar datos de ejemplo:', error);
    process.exit(1);
  }
}

seed(); 