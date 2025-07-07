import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { autenticarToken, autorizarGAD } from '../middlewares/auth.js';
import { validateReview, validateReviewStatus } from '../middlewares/validation.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Reviews Service running',
    data: {
      service: 'Reviews Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    }
  });
});

// ===== RUTAS PARA USUARIOS =====
router.post('/', autenticarToken, validateReview, reviewController.createReview);
router.get('/lugar/:lugarId', reviewController.getReviewsByPlace);
router.get('/count', reviewController.getReviewsCount);

// Endpoint para actividades (para el endpoint unificado) - SIN AUTENTICACIÓN
router.get('/admin/actividades', async (req, res) => {
  try {
    const actividades = await Activity.find().sort({ fecha: -1 }).limit(50);
    res.json({ actividades });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

// ===== RUTAS PARA ADMINISTRADORES (solo GAD) =====
router.get('/admin', autenticarToken, autorizarGAD, reviewController.getReviewsAdmin);
router.get('/admin/:id', autenticarToken, autorizarGAD, reviewController.getReviewByIdAdmin);
router.put('/admin/:id', autenticarToken, autorizarGAD, validateReviewStatus, reviewController.updateReviewStatus);
router.delete('/admin/:id', autenticarToken, autorizarGAD, reviewController.deleteReview);

export default router; 