import express from 'express';
import authController from '../controllers/authController.js';
import { autenticarToken, autorizarAdmin } from '../middlewares/auth.js';
import { validarRegistro, validarLogin, validarActualizacionPerfil, manejarErroresValidacion } from '../middlewares/validation.js';

const router = express.Router();

// ===== RUTAS PÚBLICAS =====
router.post('/register', validarRegistro, authController.registrarUsuario);
router.post('/login', validarLogin, authController.autenticarUsuario);
router.get('/validate', autenticarToken, authController.validarToken);
router.get('/health', authController.healthCheck);

// ===== RUTAS ADMINISTRATIVAS (solo ADMIN) =====
router.get('/users', autenticarToken, autorizarAdmin, authController.listarUsuarios);
router.get('/users/count', autenticarToken, autorizarAdmin, authController.getUsersCount);
router.post('/users', autenticarToken, autorizarAdmin, validarRegistro, authController.crearUsuarioAdmin);
router.put('/users/:id', autenticarToken, autorizarAdmin, authController.actualizarUsuarioAdmin);
router.patch('/users/:id/enable', autenticarToken, autorizarAdmin, authController.habilitarUsuario);
router.patch('/users/:id/disable', autenticarToken, autorizarAdmin, authController.deshabilitarUsuario);
router.delete('/users/:id', autenticarToken, autorizarAdmin, authController.eliminarUsuarioAdmin);
router.post('/logout', autenticarToken, autorizarAdmin, authController.registrarLogout);

export default router; 