import Notification from '../models/Notification.js';
import { connectSocketServer, notifyAll, notifyUser } from '../socketClient.js';

export const createNotification = (data) => Notification.create(data);

export const getNotificationsByUser = (userId) =>
  Notification.find({ userId }).sort({ createdAt: -1 });

export const getNotificationById = (id) =>
  Notification.findById(id);

export const markAsRead = (id) =>
  Notification.findByIdAndUpdate(id, { read: true }, { new: true });

export const deleteNotification = (id) =>
  Notification.findByIdAndDelete(id);

export const getNotificationsCount = () =>
  Notification.countDocuments();

export const sendNotification = async (id, message) => {
  const notificationSelected = getNotificationById(id);
  if (!notificationSelected) {
    throw new Error('Notificación no encontrada');
  }

  connectSocketServer('notifier-system');

  notifyAll({
    type: 'notification',
    message: message,
    notification: notificationSelected
  });
}
