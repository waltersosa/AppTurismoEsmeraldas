import express from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { autenticarToken, autorizarAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/mediaValidation.js';

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

// ===== RUTAS PÚBLICAS =====
router.get('/file/:filename', mediaController.getMedia);
router.get('/place/:placeId', mediaController.getMediaByPlace);
router.get('/count', mediaController.getMediaCount);

// ===== RUTAS ADMINISTRATIVAS (solo ADMIN) =====
router.post('/upload', autenticarToken, autorizarAdmin, upload.array('files', 10), mediaController.uploadMedia);
router.delete('/:mediaId', autenticarToken, autorizarAdmin, mediaController.deleteMedia);

export default router; 