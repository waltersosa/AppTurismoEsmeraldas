import express from 'express';
import { upload } from '../middlewares/mediaValidation.js';
import * as mediaController from '../controllers/mediaController.js';
import { autenticarToken, autorizarGAD } from '../middlewares/auth.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Media Service running',
    data: {
      service: 'Media Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    }
  });
});

// Rutas públicas (solo lectura)
router.get('/place/:placeId', mediaController.getMediaByPlace);
router.get('/file/:filename', mediaController.getMedia);

// Rutas protegidas (solo GAD)
router.post('/upload', autenticarToken, autorizarGAD, upload.array('files', 10), mediaController.uploadMedia);
router.delete('/:mediaId', autenticarToken, autorizarGAD, mediaController.deleteMedia);

export default router; 