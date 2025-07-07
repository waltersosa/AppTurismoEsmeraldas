import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Pega aquí el token que quieres probar
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZhZjExOTMwYzI5NzM2Mzc1ODU1MzMiLCJyb2wiOiJnYWQiLCJpYXQiOjE3NTE4Mzk5MTgsImV4cCI6MTc1MTg0NzExOH0.uitoFr2v2vrLFD6c3inh3LUkfuTbz1kIWA3yIueGbdU';

try {
  const decoded = jwt.verify(token, config.jwtSecret);
  console.log('✅ Token válido:', decoded);
} catch (error) {
  console.error('❌ Token inválido o expirado:', error.message);
} 