import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { connectSocketServer, notifyAll, enviarNotificacion } from '../utils/socketClient.js';
import mongoose from 'mongoose';

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

export const getNotificationById = (id) =>
  Notification.findById(id);

export const getAdminNotifications = async () => {
  const notifications = await Notification.find({ userId: null }).sort({ createdAt: -1 });
  return notifications;
};

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
    // Enviar a todos los usuarios por socket
    enviarNotificacion(notificationSelected.title, notificationSelected.message, 'all', notificationSelected.type);
    console.log('✅ Notificación enviada a todos los usuarios por socket');
    
    // Crear notificaciones individuales para cada usuario
    await createNotificationsForAllUsers(notificationSelected);
    console.log('✅ Notificaciones individuales creadas para todos los usuarios');
    
  } catch (error) {
    console.error('❌ No se pudo establecer la conexión al servidor:', error);
    throw error;
  }
}

// Función para crear notificaciones individuales para todos los usuarios
export const createNotificationsForAllUsers = async (notificationData) => {
  try {
    // Obtener todos los usuarios
    const users = await User.find({}, '_id');
    console.log(`📋 Encontrados ${users.length} usuarios para crear notificaciones`);
    
    // Crear notificaciones individuales para cada usuario
    const notificationsToCreate = users.map(user => ({
      title: notificationData.title,
      message: notificationData.message,
      userId: user._id,
      type: notificationData.type || 'info',
      data: notificationData.data || {},
      read: false
    }));
    
    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
      console.log(`✅ Creadas ${notificationsToCreate.length} notificaciones individuales`);
    }
    
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
}