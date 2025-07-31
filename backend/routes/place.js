import express from 'express';
import * as placeController from '../controllers/placeController.js';
import { autenticarToken, autorizarGAD } from '../middlewares/auth.js';
import { validatePlace, handleValidationErrors, cleanPlaceData } from '../middlewares/placeValidation.js';

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

// Rutas públicas (solo lectura)
router.get('/', placeController.getPlaces);
router.get('/:id', placeController.getPlaceById);

// Rutas protegidas (solo GAD)
router.post('/', autenticarToken, autorizarGAD, cleanPlaceData, validatePlace, handleValidationErrors, placeController.createPlace);
router.put('/:id', autenticarToken, autorizarGAD, cleanPlaceData, validatePlace, handleValidationErrors, placeController.updatePlace);
router.delete('/:id', autenticarToken, autorizarGAD, placeController.deletePlace);

export default router; 