import express from 'express';
import authController from '../controllers/authController.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.js';
import { 
  validarRegistro, 
  validarLogin, 
  validarCambioContraseña,
  validarActualizacionPerfil 
} from '../middlewares/validation.js';

const router = express.Router();

// Rutas públicas
router.post('/register', validarRegistro, authController.registrarUsuario);
router.post('/login', validarLogin, authController.autenticarUsuario);
router.get('/validate', authController.validarToken);
router.get('/health', authController.healthCheck);

// Rutas protegidas (requieren autenticación)
router.get('/profile', autenticarToken, authController.obtenerPerfil);
router.put('/profile', autenticarToken, validarActualizacionPerfil, authController.actualizarPerfil);
router.delete('/profile', autenticarToken, authController.eliminarUsuario);
router.put('/change-password', autenticarToken, validarCambioContraseña, authController.cambiarContraseña);

// Rutas administrativas (solo GAD)
router.get('/users', autenticarToken, autorizarRoles('gad'), authController.listarUsuarios);

export default router; 