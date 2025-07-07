// Respuestas estandarizadas para el microservicio
export const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, message = 'Error en la operación', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

export const notFoundResponse = (res, message = 'Recurso no encontrado') => {
  return res.status(404).json({
    success: false,
    message
  });
};

export const validationErrorResponse = (res, message = 'Datos de entrada inválidos') => {
  return res.status(400).json({
    success: false,
    message
  });
}; 