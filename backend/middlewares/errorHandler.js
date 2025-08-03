import { errorResponse } from '../utils/response.js';

/**
 * Middleware para manejo centralizado de errores
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors,
      timestamp: new Date().toISOString()
    });
  }

  // Errores de duplicación (código 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `El ${field} ya existe en el sistema`,
      timestamp: new Date().toISOString()
    });
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      timestamp: new Date().toISOString()
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
      timestamp: new Date().toISOString()
    });
  }

  // Errores de Cast (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
      timestamp: new Date().toISOString()
    });
  }

  // Error por defecto
  return errorResponse(res, 500, 'Error interno del servidor', err.message);
};

/**
 * Middleware para manejar rutas no encontradas
 */
export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`,
    timestamp: new Date().toISOString()
  });
}; 