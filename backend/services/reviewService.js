import Review from '../models/Review.js';

// Para usuarios: obtener reseñas públicas (todas menos bloqueadas)
export const getReviewsByPlace = async (lugarId, { page = 1, limit = 10, sortBy = 'fecha', order = 'desc' }) => {
  const query = { 
    lugarId,
    estado: { $ne: 'bloqueada' } 
  };

  const sort = {};
  sort[sortBy] = order === 'asc' ? 1 : -1;

  const total = await Review.countDocuments(query);
  console.log(total, "esto")
  const data = await Review.find(query)
    .populate('usuarioId', 'nombre')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return { data, total };
};

// Para admin: listado filtrable y paginado
export const getReviewsAdmin = async ({ 
  page = 1, 
  limit = 10, 
  estado, 
  search, 
  lugarId, 
  usuarioId, 
  calificacion,
  sortBy = 'fecha', 
  order = 'desc' 
}) => {
  const query = {};
  
  if (estado) query.estado = estado;
  if (calificacion) query.calificacion = calificacion;
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

// Funciones CRUD básicas
export const createReview = (body) => Review.create(body);
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