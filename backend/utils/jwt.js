import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { createEmailTransporter } from './mailTransporter.js';
import dotenv from 'dotenv';
import fs from 'fs/promises'
import path from 'path';
dotenv.config();

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
/**
 * Función que envia el email de notificación al
 * usuario recién registrado
 * @param {Object} user - El usuario que se acaba de resgistrar 
 */
export const generarEmail = async (user) => {
  const transporter = createEmailTransporter();

//Llamamos al archivo html que se enviará por correo.
  const filePath = path.resolve('./utils/emailsHTML/welcome.html'); 
 let htmlTemplate = await fs.readFile(filePath, { encoding: 'utf-8' });


 //Pasamos el nombre del usuario al archivo html
htmlTemplate = htmlTemplate.replace(/{{name}}/g, user.nombre); 

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: user.correo,
    subject: 'Le damos la bienvenida a mi app',
    html: htmlTemplate,
  });
}


