/**
 * Respuesta exitosa estandarizada
 * @param {Object} res - Objeto response de Express
 * @param {number} statusCode - Código de estado HTTP
 * @param {string} message - Mensaje de respuesta
 * @param {*} data - Datos a enviar
 */
export const successResponse = (res, statusCode = 200, message = 'Operación exitosa', data = null) => {
  const response = {
    success: true,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Respuesta de error estandarizada
 * @param {Object} res - Objeto response de Express
 * @param {number} statusCode - Código de estado HTTP
 * @param {string} message - Mensaje de error
 * @param {*} error - Detalles del error (opcional)
 */
export const errorResponse = (res, statusCode = 500, message = 'Error interno del servidor', error = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (error && process.env.NODE_ENV === 'development') {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

/**
 * Respuesta de validación estandarizada
 * @param {Object} res - Objeto response de Express
 * @param {Array} errors - Array de errores de validación
 */
export const validationResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Errores de validación',
    errors: errors.array(),
    timestamp: new Date().toISOString()
  });
};

/**
 * Respuesta de autenticación fallida
 * @param {Object} res - Objeto response de Express
 * @param {string} message - Mensaje de error de autenticación
 */
export const authErrorResponse = (res, message = 'Credenciales inválidas') => {
  return res.status(401).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
}; 