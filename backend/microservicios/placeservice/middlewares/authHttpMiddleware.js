import axios from 'axios';

export const autenticarTokenPorHttp = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Cambia la URL si tu authservice está en otro host/puerto
    const response = await axios.get('http://localhost:3001/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
    req.usuario = response.data.usuario;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado (validado por authservice)' });
  }
}; 