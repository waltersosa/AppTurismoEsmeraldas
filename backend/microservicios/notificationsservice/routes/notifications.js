import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

// Crear notificación (usado por otros microservicios)
router.post('/', notificationController.createNotification);

// Listar notificaciones de un usuario
router.get('/user/:userId', notificationController.getNotificationsByUser);

// Obtener detalle de una notificación
router.get('/:id', notificationController.getNotificationById);

// Marcar como leída
router.patch('/:id/read', notificationController.markAsRead);

// Eliminar notificación
router.delete('/:id', notificationController.deleteNotification);

// Conteo total de notificaciones
router.get('/count', notificationController.getNotificationsCount);

// Envio de notificación (usado por otros microservicios)
router.post('/send:id', notificationController.sendNotification);

export default router; 