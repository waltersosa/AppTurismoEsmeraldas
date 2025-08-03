import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { autenticarToken, autorizarAdmin } from '../middlewares/auth.js';

const router = express.Router();

// ===== RUTAS PÚBLICAS =====
router.get('/lugar/:placeId', reviewController.getReviewsByPlace);
router.get('/count', reviewController.getReviewsCount);

// ===== RUTAS PARA USUARIOS AUTENTICADOS =====
router.post('/', autenticarToken, reviewController.createReview);

// ===== RUTAS PARA ADMINISTRADORES (solo ADMIN) =====
router.get('/admin', autenticarToken, autorizarAdmin, reviewController.getReviewsAdmin);
router.get('/admin/:id', autenticarToken, autorizarAdmin, reviewController.getReviewByIdAdmin);
router.put('/admin/:id', autenticarToken, autorizarAdmin, reviewController.updateReviewStatus);
router.delete('/admin/:id', autenticarToken, autorizarAdmin, reviewController.deleteReview);

export default router; 