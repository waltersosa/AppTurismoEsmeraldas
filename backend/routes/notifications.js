import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { autenticarToken, autorizarAdmin } from '../middlewares/auth.js';

const router = express.Router();

// ===== RUTAS PÚBLICAS =====
router.get('/', notificationController.getNotificationsByUser);
router.get('/:id', notificationController.getNotificationById);
router.get('/count', notificationController.getNotificationsCount);

// ===== RUTAS PARA USUARIOS AUTENTICADOS =====
router.post('/', autenticarToken, notificationController.createNotification);
router.put('/:id/read', autenticarToken, notificationController.markAsRead);
router.delete('/:id', autenticarToken, notificationController.deleteNotification);

// ===== RUTAS ADMINISTRATIVAS (solo ADMIN) =====
router.get('/admin', autenticarToken, autorizarAdmin, notificationController.getAdminNotification);
router.post('/send/:id', autenticarToken, autorizarAdmin, notificationController.sendNotification);
router.post('/send/:userId/:notiId', autenticarToken, autorizarAdmin, notificationController.sendNotificationToSingleUser);

export default router; 