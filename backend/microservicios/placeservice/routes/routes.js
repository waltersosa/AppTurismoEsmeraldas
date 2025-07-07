import express from 'express';
import placeController from '../controllers/placeController.js';
import { autenticarTokenPorHttp } from '../middlewares/authHttpMiddleware.js';
import { autorizarGAD } from '../middlewares/authMiddleware.js';
import { getUnifiedActivities } from '../controllers/activityController.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Places Service running',
    data: {
      service: 'Places Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    }
  });
});

// Ruta básica de prueba
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Places Service working' });
});

// Endpoints públicos
router.get('/', placeController.getPlaces);
router.get('/count', placeController.getPlacesCount);
router.get('/admin/activities', placeController.listAdminActivities);
router.get('/admin/actividades-unificadas', getUnifiedActivities);

// Endpoints con parámetros
router.get('/:id', placeController.getPlaceById);

// Endpoints protegidos (solo GAD)
router.post('/', autenticarTokenPorHttp, autorizarGAD, placeController.createPlace);
router.put('/:id', autenticarTokenPorHttp, autorizarGAD, placeController.updatePlace);
router.patch('/:id/status', autenticarTokenPorHttp, autorizarGAD, placeController.updatePlaceStatus);
router.delete('/:id', autenticarTokenPorHttp, autorizarGAD, placeController.deletePlace);

export default router; 