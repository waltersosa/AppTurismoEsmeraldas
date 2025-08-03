import { extraerToken, verificarToken } from '../utils/jwt.js';
import { authErrorResponse } from '../utils/response.js';
import authService from '../services/authService.js';

/**
 * Middleware para verificar autenticación JWT
 */
export const autenticarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
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
 * Middleware para verificar si el usuario tiene uno de los roles especificados
 * @param {...string} roles - Roles permitidos
 */
export const autorizarRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          success: false,
          message: 'Token no válido'
        });
      }

      if (!roles.includes(req.usuario.rol)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para realizar esta acción'
        });
      }

      next();
    } catch (error) {
      console.error('Error en autorizarRoles:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware para verificar si es propietario o admin
 */
export const autorizarPropietarioOAdmin = (req, res, next) => {
  return autorizarRoles('propietario', 'admin')(req, res, next);
};

/**
 * Middleware para verificar si es admin
 */
export const autorizarAdmin = (req, res, next) => {
  return autorizarRoles('admin')(req, res, next);
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