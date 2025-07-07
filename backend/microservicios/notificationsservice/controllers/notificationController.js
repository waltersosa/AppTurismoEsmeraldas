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