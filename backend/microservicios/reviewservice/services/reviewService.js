import Review from '../models/Review.js';
import axios from 'axios';
import config from '../config/config.js';

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

// Crear reseña con validación de lugar existente
export const createReview = async (body) => {
  // Verificar que el lugar existe consultando al microservicio de lugares
  try {
    const response = await axios.get(`${config.placesServiceUrl}/places/${body.lugarId}`);
    if (!response.data.success) {
      throw new Error('Lugar no encontrado');
    }
  } catch (error) {
    throw new Error('Lugar no encontrado o error de comunicación');
  }

  return Review.create(body);
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