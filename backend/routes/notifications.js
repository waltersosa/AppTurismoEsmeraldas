import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { autenticarToken, autorizarAdmin } from '../middlewares/auth.js';

const router = express.Router();

// ===== RUTAS ADMINISTRATIVAS (solo ADMIN) =====
router.get('/admin', autenticarToken, autorizarAdmin, notificationController.getAdminNotification);
router.post('/send/:id', autenticarToken, autorizarAdmin, notificationController.sendNotification);
router.post('/send/:userId/:notiId', autenticarToken, autorizarAdmin, notificationController.sendNotificationToSingleUser);

// ===== RUTAS PÚBLICAS =====
router.get('/count', notificationController.getNotificationsCount);
router.get('/admin', autenticarToken, autorizarAdmin, notificationController.getAdminNotification);
router.get('/by-user/:userId', notificationController.getNotificationsByUser);

// ===== RUTAS PARA USUARIOS AUTENTICADOS =====
router.post('/', autenticarToken, notificationController.createNotification);
router.put('/:id/read', autenticarToken, notificationController.markAsRead);
router.delete('/:id', autenticarToken, notificationController.deleteNotification);


export default router; 