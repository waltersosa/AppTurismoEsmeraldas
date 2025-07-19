/**
 * Este archivo se usa para generar una conexión socket al servidor de notificaciones.
 */
import { io, Socket } from 'socket.io-client';

let socket;

export function connectSocketServer(userId = 'system') {
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
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Error de conexión:', err.message);
    });
  }
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
    socket.emit('notification', data);
    console.log('[Socket] Notificación enviada a todos los usuarios');
  } else {
    console.error('[Socket] No conectado. No se pudo enviar la notificación a todos.');
  }
}