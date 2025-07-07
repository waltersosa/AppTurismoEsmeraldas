import express from 'express';
import { getStats, getHealthOverview } from '../controllers/statsController.js';
import { stopService, startService } from '../controllers/processController.js';

const router = express.Router();

// Endpoint principal de estadísticas
router.get('/overview', getStats);

// Endpoint de healthcheck de todos los servicios
router.get('/health/overview', getHealthOverview);

// Endpoints de control de procesos (solo local)
router.post('/service/:name/stop', stopService);
router.post('/service/:name/start', startService);

export default router; 