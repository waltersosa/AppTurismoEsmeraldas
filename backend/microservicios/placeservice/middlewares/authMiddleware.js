import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const autenticarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export const autorizarGAD = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== 'gad') {
    return res.status(403).json({ error: 'No tienes permisos para esta acción' });
  }
  next();
}; 