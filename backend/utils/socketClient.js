/**
 * Este archivo se usa para generar una conexión socket al servidor de notificaciones.
 */
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

let socket;

export function connectSocketServer(userId = 'system') {
  //Esta función manda un promesa que se resuelve cuando se establece la conexión al servidor Socket.io
  //Esto se hizo así intencionalmente para evitar que las notificaciones se manden antes de que la conexión esté lista
  return new Promise((resolve, reject) => {
    if (!socket || !socket.connected) {
      //Crea la conexión al servidor Spcket.io
      socket = io('https://geoapi.esmeraldas.gob.ec', {
        path: '/new/socket.io',
        transports: ['websocket'],
      });

      // Evento que se ejecuta cuando la conexión se establece correctamente
      socket.on('connect', () => {
        console.log('[Socket] Conectado al servidor');
        socket.emit('set-user-id', userId);
        resolve(socket);
      });

      socket.on('connect_error', (err) => {
        console.error('[Socket] Error de conexión:', err.message);
        reject(err);
      });
    } else {
      resolve(socket); //Si ya está conectado, resuelve la promesa directamente
    }
  });
}

//ESta es la función que se usa para enviar notificaciones a un usuario específico
// userId es el ID del usuario al que se le enviará la notificación
export function notifyUser(userId, data) {
  if (socket && socket.connected) {
    socket.emit('notify-user', { userId, data });
    console.log(`[Socket] Notificación enviada al usuario ${userId}`);
  } else {
    console.error('[Socket] No conectado. No se pudo enviar la notificación.');
  }
}

export function notifyAll(data) {
  if (socket && socket.connected) {
    // console.log('[Socket] Enviando notificación a todos los usuarios:', data);
    socket.emit('notification', data);
    console.log('[Socket] Notificación enviada a todos los usuarios');
  } else {
    console.error('[Socket] No conectado. No se pudo enviar la notificación a todos.');
  }
}


export function enviarNotificacion(titulo, mensaje, userId = null) {
  axios.post('http://localhost:3000/emitir', {
    titulo,
    mensaje,
    userId // puede ser null o undefined para todos
  })
    .then(res => {
      console.log('✅ Notificación enviada:', res.data);
    })
    .catch(err => {
      console.error('❌ Error enviando notificación:', err.message);
    });
}


