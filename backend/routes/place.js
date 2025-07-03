import express from 'express';
import * as placeController from '../controllers/placeController.js';

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

router.get('/', placeController.getPlaces);
router.get('/:id', placeController.getPlaceById);
router.post('/', placeController.createPlace);
router.put('/:id', placeController.updatePlace);
router.delete('/:id', placeController.deletePlace);

export default router; 