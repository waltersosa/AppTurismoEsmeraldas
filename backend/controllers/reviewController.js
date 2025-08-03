import * as reviewService from '../services/reviewService.js';

// ===== RUTAS PARA USUARIOS =====

// Crear una reseña
export const createReview = async (req, res, next) => {
  try {
    const { lugarId, comentario, calificacion } = req.body;
    const usuarioId = req.usuario.id;

    const review = await reviewService.createReview({
      lugarId,
      usuarioId,
      comentario,
      calificacion
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// Obtener reseñas públicas aprobadas de un lugar
export const getReviewsByPlace = async (req, res, next) => {
  try {
    const { lugarId } = req.params;
    const { page, limit, sortBy, order } = req.query;
    
    const { data, total } = await reviewService.getReviewsByPlace(lugarId, { 
      page, limit, sortBy, order 
    });

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: Number(page) || 1,
        limit: Number(limit) || 10
      }
    });
  } catch (err) {
    next(err);
  }
};

// ===== RUTAS PARA ADMINISTRADORES =====

// Listado filtrable y paginado para administradores
export const getReviewsAdmin = async (req, res, next) => {
  try {
    const { page, limit, estado, search, lugarId, usuarioId, sortBy, order } = req.query;
    
    const { data, total } = await reviewService.getReviewsAdmin({ 
      page, limit, estado, search, lugarId, usuarioId, sortBy, order 
    });

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: Number(page) || 1,
        limit: Number(limit) || 10
      }
    });
  } catch (err) {
    next(err);
  }
};

// Aprobar o rechazar una reseña
export const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['pendiente', 'aprobada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estado inválido. Debe ser: pendiente, aprobada o rechazada' 
      });
    }

    const review = await reviewService.updateReview(id, { estado });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review no encontrada' });
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// Eliminar una reseña
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await reviewService.deleteReview(id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review no encontrada' });
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// Obtener una reseña específica para administradores
export const getReviewByIdAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await reviewService.getReviewById(id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review no encontrada' });
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// Obtener conteo de reseñas
export const getReviewsCount = async (req, res, next) => {
  try {
    const count = await reviewService.getReviewsCount();
    res.json({ 
      success: true,
      data: { count }
    });
  } catch (err) {
    next(err);
  }
}; 