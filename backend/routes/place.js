import express from 'express';
import * as placeController from '../controllers/placeController.js';
import { autenticarToken, autorizarAdmin } from '../middlewares/auth.js';
import { cleanPlaceData, validatePlace, handleValidationErrors } from '../middlewares/placeValidation.js';

const router = express.Router();

// ===== RUTAS PÚBLICAS =====
router.get('/', placeController.getPlaces);
router.get('/count', placeController.getPlacesCount);
router.get('/:id', placeController.getPlaceById);

// ===== RUTAS ADMINISTRATIVAS (solo ADMIN) =====
router.post('/', autenticarToken, autorizarAdmin, cleanPlaceData, validatePlace, handleValidationErrors, placeController.createPlace);
router.put('/:id', autenticarToken, autorizarAdmin, cleanPlaceData, validatePlace, handleValidationErrors, placeController.updatePlace);
router.delete('/:id', autenticarToken, autorizarAdmin, placeController.deletePlace);

export default router; 