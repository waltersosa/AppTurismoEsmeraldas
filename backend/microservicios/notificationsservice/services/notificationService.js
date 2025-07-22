import Notification from '../models/Notification.js';
import { connectSocketServer, notifyAll, enviarNotificacion } from '../socketClient.js';

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

export const sendNotification = async (id) => {
  console.log('Enviando notificación:', id);

  const notificationSelected = await getNotificationById(id).lean().exec();

  if (!notificationSelected) {
    throw new Error('Notificación no encontrada');
  }

  try {

    //await connectSocketServer('notifier-system');
    //console.log("NOtificación a enviar:", notificationSelected);
    /*  notifyAll({
        type: 'notification',
        message: notificationSelected.message,
        notification: notificationSelected
      })
      console.log('Payload de notificación enviada:', {
        type: 'notification',
        message: notificationSelected.message,
        notification: notificationSelected
      });*/
    enviarNotificacion(notificationSelected.title, notificationSelected.message);
  } catch (error) {
    console.error('No se pudo establecerla conexión al servidor:', error);
  }
}
