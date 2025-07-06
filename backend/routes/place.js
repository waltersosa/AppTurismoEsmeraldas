import express from 'express';
import * as placeController from '../controllers/placeController.js';
import { autenticarToken, autorizarGAD } from '../middlewares/auth.js';
import { validateCreatePlace, validateUpdatePlace, validatePartialUpdate, handleValidationErrors, cleanPlaceData } from '../middlewares/placeValidation.js';

const router = express.Router();

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

// Endpoint de prueba para validaciones
router.post('/test', cleanPlaceData, validateCreatePlace, handleValidationErrors, (req, res) => {
  res.json({
    success: true,
    message: 'Datos válidos',
    data: req.body
  });
});

// Rutas públicas (solo lectura)
router.get('/', placeController.getPlaces);
router.get('/:id', placeController.getPlaceById);

// Rutas protegidas (solo GAD)
router.post('/', autenticarToken, autorizarGAD, cleanPlaceData, validateCreatePlace, handleValidationErrors, placeController.createPlace);
router.put('/:id', autenticarToken, autorizarGAD, cleanPlaceData, validateUpdatePlace, handleValidationErrors, placeController.updatePlace);
router.patch('/:id/status', autenticarToken, autorizarGAD, validatePartialUpdate, handleValidationErrors, placeController.updatePlaceStatus);
router.delete('/:id', autenticarToken, autorizarGAD, placeController.deletePlace);

export default router; 