import Notification from '../models/Notification.js';
import mongoose from 'mongoose';
//import { connectSocketServer, notifyAll, enviarNotificacion } from '../utils/socketClient.js';

export const createNotification = (data) => {
  // Si userId es null, undefined, o cadena vacía, establecerlo como null explícitamente
  if (!data.userId || data.userId === '' || data.userId === 'null') {
    data.userId = null;
  }

  return Notification.create(data);
};

export const getNotificationsByUser = (userId) => {
  // Si userId está vacío o no es válido, retornar array vacío
  if (!userId || userId === '' || userId === 'null' || userId === 'undefined') {
    return Promise.resolve([]);
  }

  // Verificar si userId es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return Promise.resolve([]);
  }

  return Notification.find({ userId }).sort({ createdAt: -1 });
};

//Retorna todas las notificaciones vinculadas a un usuario y catalogadas como leidas
export const getSentNotifications = (userId) => {
  // Si userId está vacío o no es válido, retornar array vacío
  if (!userId || userId === '' || userId === 'null' || userId === 'undefined') {
    return Promise.resolve([]);
  }

  // Verificar si userId es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return Promise.resolve([]);
  }

  return Notification.find({
    $or: [
      { userId: userId },
      { sent: true, userId: null }
    ]
  }).sort({ createdAt: -1 });

}

export const getNotificationById = (id) =>
  Notification.findById(id);

export const getAdminNotifications = async () => {
  const notifications = await Notification.find({ userId: null, sent: false }).sort({ createdAt: -1 });
  return notifications;
};

export const markAsRead = (id) =>
  Notification.findByIdAndUpdate(id, { read: true }, { new: true });

export const deleteNotification = (id) =>
  Notification.findByIdAndDelete(id);

export const getNotificationsCount = () =>
  Notification.countDocuments();
/*
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
/*  enviarNotificacion(notificationSelected.title, notificationSelected.message);
} catch (error) {
  console.error('❌ Error al crear notificaciones individuales:', error);
  throw error;
}
}


export const sendNotificationToSingleUser = async (userId, notiId) => {
const notificationSelected = await getNotificationById(notiId).lean().exec();

if (!notificationSelected) {
  throw new Error('Esta notificación no existe');
}

try {

  enviarNotificacion(notificationSelected.title, notificationSelected.message,
    userId, notificationSelected.type);
} catch (error) {
  console.error('No se pudo establecer conexión', error)
}
}*/