import express from 'express';
import placeController from '../controllers/placeController.js';
import { autenticarTokenPorHttp } from '../middlewares/authHttpMiddleware.js';
import { autorizarGAD } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta raíz - Estado del servicio
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PlaceService - Microservicio de Lugares Turísticos',
    data: {
      service: 'PlaceService',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/places/health',
        places: '/places',
        admin: '/places/admin/actividades'
      }
    }
  });
});

// Health check
router.get('/places/health', (req, res) => {
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

// Endpoint de prueba para validaciones
router.post('/places/test', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ success: false, message: 'El campo name es obligatorio' });
  }
  res.json({ success: true, message: 'Datos válidos', data: req.body });
});

// Endpoints públicos
router.get('/places', placeController.getPlaces);
router.get('/places/count', placeController.getPlacesCount);
router.get('/places/:id', placeController.getPlaceById);

// Endpoints protegidos (solo GAD)
router.post('/places', autenticarTokenPorHttp, autorizarGAD, placeController.createPlace);
router.put('/places/:id', autenticarTokenPorHttp, autorizarGAD, placeController.updatePlace);
router.patch('/places/:id/status', autenticarTokenPorHttp, autorizarGAD, placeController.updatePlaceStatus);
router.delete('/places/:id', autenticarTokenPorHttp, autorizarGAD, placeController.deletePlace);
router.get('/places/admin/actividades', autenticarTokenPorHttp, autorizarGAD, placeController.listAdminActivities);

export default router; 