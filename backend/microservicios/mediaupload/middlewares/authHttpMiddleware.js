import axios from 'axios';
import config from '../config/config.js';

// Validar token JWT consultando al microservicio de autenticación
export const autenticarTokenPorHttp = async (req, res, next) => {
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