import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

/**
 * Genera un token JWT para un usuario
 * @param {Object} payload - Datos del usuario para incluir en el token
 * @returns {string} Token JWT generado
 */
export const generarToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'esmeraldas-turismo-auth',
    audience: 'esmeraldas-turismo-users'
  });
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Payload decodificado del token
 */
export const verificarToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'esmeraldas-turismo-auth',
      audience: 'esmeraldas-turismo-users'
    });
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Extrae el token del header Authorization
 * @param {string} authHeader - Header Authorization completo
 * @returns {string|null} Token extraído o null si no se encuentra
 */
export const extraerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remover "Bearer " del inicio
};

/**
 * Genera payload para el token JWT
 * @param {Object} user - Objeto usuario de MongoDB
 * @returns {Object} Payload para el token
 */
export const generarPayload = (user) => {
  return {
    id: user._id,
    nombre: user.nombre,
    correo: user.correo,
    rol: user.rol,
    iat: Math.floor(Date.now() / 1000)
    // No incluir 'exp' aquí, se maneja automáticamente con expiresIn
  };
}; 