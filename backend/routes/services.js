import express from 'express';
import serviceController from '../controllers/serviceController.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas (solo lectura)
router.get('/', serviceController.listarServicios);
router.get('/stats', serviceController.obtenerEstadisticas);
router.get('/:id', serviceController.obtenerServicio);

// Rutas protegidas (solo GAD)
router.put('/:id', autenticarToken, autorizarRoles('gad'), serviceController.actualizarServicio);
router.patch('/:id/toggle', autenticarToken, autorizarRoles('gad'), serviceController.alternarEstadoServicio);
router.post('/:id/check', autenticarToken, autorizarRoles('gad'), serviceController.verificarServicio);
router.post('/check-all', autenticarToken, autorizarRoles('gad'), serviceController.verificarTodosServicios);
router.patch('/activate-all', autenticarToken, autorizarRoles('gad'), serviceController.activarTodosServicios);
router.patch('/deactivate-all', autenticarToken, autorizarRoles('gad'), serviceController.desactivarTodosServicios);

export default router; 