import * as notificationService from '../services/notificationService.js';

export const createNotification = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsByUser(req.params.userId);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const notification = await notificationService.getNotificationById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
/**
 * Esta función busca las notificaciones cuyo userId, sea null. Esto es importante, porque permite
 * separar las notificaciones a las cuales tiene acceso los administradores, de las que se envian al 
 * usuario.
 * Más información en el README.md
 */
export const getAdminNotification = async (req, res) => {
  try {
    const notification = await notificationService.getAdminNotifications();
    if (!notification) return res.status(404).json({
      success: false, message: 'Hubo un problema,'
        + 'parece que no hay notificaciones en la base de datos para enviar'
    });
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('Hubo un error al recoger las notificaciones administrativas', error);
    res.status(400).json({ message: 'Error interno del servidor' });
  }
}

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await notificationService.deleteNotification(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    res.json({ success: true, message: 'Notificación eliminada' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNotificationsCount = async (req, res) => {
  try {
    const count = await notificationService.getNotificationsCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendNotification = async (req, res) => {
  try {

    const notification = await notificationService.sendNotification(req.params.id, req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const sendNotificationToSingleUser = async (req, res) => {
  try {
    console.log('Llegó al controlador con los datos', req.body)

    const notification = await notificationService.sendNotificationToSingleUser(req.params.userId,
      req.params.notiId, req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

