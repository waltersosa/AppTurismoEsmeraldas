import express from 'express';
import authController from '../controllers/authController.js';
import { autenticarToken, autorizarRoles } from '../middlewares/authMiddleware.js';
import { 
  validarRegistro, 
  validarLogin, 
  validarCambioContraseña, 
  validarActualizacionPerfil,
  validarCrearUsuario 
} from '../middlewares/validation.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Rutas públicas
router.post('/auth/register', validarRegistro, authController.register);
router.post('/auth/login', validarLogin, authController.login);
router.get('/auth/validate', authController.validateToken);
router.get('/auth/health', authController.healthCheck);
router.get('/auth/users/count', authController.getUsersCount);

// Rutas protegidas
router.get('/auth/profile', autenticarToken, authController.getProfile);
router.put('/auth/profile', autenticarToken, validarActualizacionPerfil, authController.updateProfile);
router.delete('/auth/profile', autenticarToken, authController.deleteProfile);
router.put('/auth/change-password', autenticarToken, validarCambioContraseña, authController.changePassword);

// Rutas administrativas (solo GAD)
router.get('/auth/users', autenticarToken, autorizarRoles('gad'), authController.listUsers);
router.post('/auth/users', autenticarToken, autorizarRoles('gad'), validarCrearUsuario, authController.createUserByAdmin);
router.delete('/auth/users/:id', autenticarToken, autorizarRoles('gad'), authController.disableUserByAdmin);
router.patch('/auth/users/:id/enable', autenticarToken, autorizarRoles('gad'), authController.enableUserByAdmin);
router.delete('/auth/users/:id/permanent', autenticarToken, autorizarRoles('gad'), authController.deleteUserByAdmin);
router.get('/auth/admin/actividades', autenticarToken, autorizarRoles('gad'), authController.listAdminActivities);

router.get('/admin/actividades', async (req, res) => {
  try {
    const actividades = await Activity.find().sort({ fecha: -1 }).limit(50);
    res.json({ actividades });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

export default router; 