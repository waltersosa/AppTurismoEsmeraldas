import express from 'express';
import { getAllServicesHealth, getServiceHealth, getSimpleHealth } from '../controllers/healthController.js';
import { getHealthOverview } from '../controllers/statsController.js';

const router = express.Router();

// Health check de todos los servicios
router.get('/', getAllServicesHealth);

// Health check simplificado (para monitoreo)
router.get('/simple', getSimpleHealth);

// Health check overview real (debe ir antes de la ruta dinámica)
router.get('/overview', getHealthOverview);

// Health check de un servicio específico
router.get('/:serviceName', getServiceHealth);

export default router; 