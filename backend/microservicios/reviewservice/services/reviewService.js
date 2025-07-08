import Review from '../models/Review.js';
import axios from 'axios';
import config from '../config/config.js';
import mongoose from 'mongoose';

// Para usuarios: obtener reseñas públicas (todas menos bloqueadas)
export const getReviewsByPlace = async (lugarId, { page = 1, limit = 10, sortBy = 'fecha', order = 'desc' }) => {
  const query = { 
    lugarId,
    estado: { $ne: 'bloqueada' } 
  };

  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  const total = await Review.countDocuments(query);
  const data = await Review.find(query)
    .populate('usuarioId', 'nombre')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return { data, total };
};

// Para administradores: listado filtrable y paginado
export const getReviewsAdmin = async ({ 
  page = 1, 
  limit = 10, 
  estado, 
  search, 
  lugarId, 
  usuarioId, 
  sortBy = 'fecha', 
  order = 'desc' 
}) => {
  const query = {};
  
  if (estado) query.estado = estado;
  if (lugarId) query.lugarId = lugarId;
  if (usuarioId) query.usuarioId = usuarioId;
  if (search) query.comentario = { $regex: search, $options: 'i' };

  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  const total = await Review.countDocuments(query);
  const data = await Review.find(query)
    .populate('lugarId', 'name')
    .populate('usuarioId', 'nombre')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return { data, total };
};

// Crear reseña con validación de lugar existente y notificación al propietario
export const createReview = async (body) => {
  // Verificar que el lugar existe consultando al microservicio de lugares
  let ownerId = null;
  try {
    const response = await axios.get(`${config.placesServiceUrl}/places/${body.lugarId}`);
    if (!response.data.success) {
      throw new Error('Lugar no encontrado');
    }
    // Suponiendo que el ownerId viene en el lugar
    ownerId = response.data.data.ownerId;
  } catch (error) {
    throw new Error('Lugar no encontrado o error de comunicación');
  }

  // Crear la reseña
  console.log('Objeto que se va a guardar en Review:', body);
  const review = await Review.create(body);

  // Enviar notificación al propietario si existe ownerId
  if (ownerId) {
    try {
      await axios.post('http://localhost:3006/notifications', {
        userId: ownerId,
        type: 'review',
        title: 'Nueva reseña recibida',
        message: `Tu lugar ha recibido una nueva reseña.`,
        data: {
          lugarId: body.lugarId,
          reviewId: review._id
        }
      });
    } catch (err) {
      // No interrumpe el flujo si falla la notificación
      console.error('Error enviando notificación al propietario:', err.message);
    }
  }

  return review;
};

// Funciones CRUD básicas
export const getReviewById = (id) => Review.findById(id).populate('lugarId', 'name').populate('usuarioId', 'nombre');
export const updateReview = (id, body) => Review.findByIdAndUpdate(id, body, { new: true });
export const deleteReview = (id) => Review.findByIdAndDelete(id);

// Verificar si un usuario ya ha reseñado un lugar
export const checkUserReviewExists = (lugarId, usuarioId) => {
  return Review.findOne({ lugarId, usuarioId });
};

// Obtener conteo de reseñas
export const getReviewsCount = async () => {
  return await Review.countDocuments();
}; 