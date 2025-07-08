import axios from 'axios';
import config from '../config/config.js';

// Validar token JWT consultando al microservicio de autenticación
export const autenticarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acceso requerido' 
      });
    }

    // Validar token consultando al microservicio de autenticación
    const response = await axios.get(`${config.authServiceUrl}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.message === 'Token válido') {
      req.usuario = response.data.usuario;
      console.log('USUARIO AUTENTICADO EN REVIEWSERVICE:', req.usuario);
      next();
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }
  } catch (error) {
    console.error('Error validando token:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido o error de autenticación' 
    });
  }
};

// Autorizar solo usuarios con rol GAD
export const autorizarGAD = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ 
      success: false, 
      message: 'Usuario no autenticado' 
    });
  }

  if (req.usuario.rol !== 'gad') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acceso denegado. Solo administradores GAD pueden realizar esta acción' 
    });
  }

  next();
}; 