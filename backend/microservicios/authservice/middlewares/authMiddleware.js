// Middleware de autenticación (base)

import jwtUtils from '../utils/jwt.js';
import config from '../config/config.js';
import User from '../models/User.js';

export const autenticarToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwtUtils.verify(token, config.jwtSecret);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    req.usuario = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export const autorizarRoles = (...roles) => (req, res, next) => {
  if (!req.usuario || !roles.includes(req.usuario.rol)) {
    return res.status(403).json({ error: 'No tienes permisos para esta acción' });
  }
  next();
}; 