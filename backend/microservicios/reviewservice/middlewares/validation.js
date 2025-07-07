// Validar datos de creación de reseña
export const validateReview = (req, res, next) => {
  const { lugarId, comentario, calificacion } = req.body;

  if (!lugarId) {
    return res.status(400).json({
      success: false,
      message: 'ID del lugar es requerido'
    });
  }

  if (!comentario || comentario.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Comentario es requerido'
    });
  }

  if (comentario.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'El comentario debe tener al menos 10 caracteres'
    });
  }

  if (!calificacion || calificacion < 1 || calificacion > 5) {
    return res.status(400).json({
      success: false,
      message: 'La calificación debe estar entre 1 y 5'
    });
  }

  next();
};

// Validar estado de reseña
export const validateReviewStatus = (req, res, next) => {
  const { estado } = req.body;

  if (!estado || !['aprobada', 'bloqueada'].includes(estado)) {
    return res.status(400).json({
      success: false,
      message: 'Estado inválido. Debe ser: aprobada o bloqueada'
    });
  }

  next();
}; 