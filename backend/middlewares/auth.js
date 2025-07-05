import { extraerToken, verificarToken } from '../utils/jwt.js';
import { authErrorResponse } from '../utils/response.js';
import authService from '../services/authService.js';

/**
 * Middleware para verificar autenticación JWT
 */
export const autenticarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader);
    const token = extraerToken(authHeader);

    if (!token) {
      return authErrorResponse(res, 'Token de acceso requerido');
    }

    // Validar token y obtener datos del usuario
    const usuario = await authService.validarToken(token);
    
    // Agregar datos del usuario al request
    req.usuario = usuario;
    next();
  } catch (error) {
    return authErrorResponse(res, error.message);
  }
};

/**
 * Middleware para verificar roles específicos
 * @param {...string} roles - Roles permitidos
 */
export const autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return authErrorResponse(res, 'Autenticación requerida');
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
        timestamp: new Date().toISOString()
      });
    }

    next();
  };
};

/**
 * Middleware para verificar si es propietario o GAD
 */
export const autorizarPropietarioOGAD = (req, res, next) => {
  return autorizarRoles('propietario', 'gad')(req, res, next);
};

/**
 * Middleware para verificar si es GAD
 */
export const autorizarGAD = (req, res, next) => {
  return autorizarRoles('gad')(req, res, next);
};

/**
 * Middleware opcional de autenticación (no falla si no hay token)
 */
export const autenticacionOpcional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extraerToken(authHeader);

    if (token) {
      const usuario = await authService.validarToken(token);
      req.usuario = usuario;
    }
    
    next();
  } catch (error) {
    // Si hay error, continuar sin usuario autenticado
    next();
  }
}; 