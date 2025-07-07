import express from 'express';
import { controlService, getServicesInfo, getServiceStatus, stopAllServices, startAllServices } from '../controllers/serviceController.js';

const router = express.Router();

// Obtener información de todos los servicios
router.get('/', getServicesInfo);

// Obtener estado de un servicio específico
router.get('/:serviceName/status', getServiceStatus);

// Rutas específicas primero
router.post('/stopAll', stopAllServices);
router.post('/startAll', startAllServices);

// Rutas dinámicas después
router.post('/:serviceName/:action', controlService);

export default router; 