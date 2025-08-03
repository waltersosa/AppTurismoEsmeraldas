// src/app/services/notification-socket.service.ts
/*import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationSocketService {
  private socket: Socket | undefined;
  //private readonly SOCKET_URL = 'https://geoapi.esmeraldas.gob.ec';
  private readonly SOCKET_URL = 'http://localhost:3000';
  private readonly SOCKET_PATH = '/new/socket.io';

  constructor(private ngZone: NgZone) { }

  connect(userId: string): void {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(this.SOCKET_URL, {
        path: this.SOCKET_PATH,
        transports: ['websocket'],
        //  withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to notification socket');
        this.socket?.emit('set-user-id', userId);
      });

      this.socket.on('connect_error', (err: Error) => {
        console.error('[Socket] Connection error:', err);
      });


      // Agrega aquí para debug:

      this.socket.onAny((event, ...args) => {
        console.log('SOCKET EVENTO RECIBIDO:', event, args);
      });

      this.socket.on('notification', (data) => {
        console.log('[Socket] Evento notification recibido:', data);
      });
      this.socket.on('notified-user', (data) => {
        console.log('[Socket] Evento notified-user recibido:', data);
      });



    }
  }


 onNotification(): Observable<any> {
   return new Observable(observer => {
     this.socket?.on('notification', (data) => {
       console.log('🔔 Notificación recibida:', data);
       observer.next(data);
     });
   });
 }

 // Si tienes notificaciones dirigidas al usuario:
 onNotifiedUser(): Observable<any> {
   return new Observable((observer) => {
     this.socket?.on('notified-user', (data: any) => {
       this.ngZone.run(() => {
         observer.next(data);
       });
     });
     return () => this.socket?.off('notified-user');
   });
 }

 disconnect(): void {
   this.socket?.disconnect();
   this.socket = undefined;
 }
}
*/
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    //this.initializeStorageListener();
  }
  private initializeStorageListener() {
    console.log("INICIALIZADOR DE ESCUCHA SOCKET");
    // Escucha cambios en localStorage y sessionStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'userId') {
        this.inicializador();
      }
    });
  }
  inicializador() {
    try {
      const userId =
        localStorage.getItem('userId') ||
        sessionStorage.getItem('userId');
      console.log("🔌 Inicializando socket para usuario:", userId);
      
      if (userId) {
        this.socket = io('https://geoapi.esmeraldas.gob.ec', {
          path: '/new/socket.io',
          transports: ['websocket', 'polling'],
          timeout: 10000
        });

        this.socket.on('connect', () => {
          console.log('✅ Socket connected:', this.socket.connected);

          if (userId) {
            this.socket.emit('set-user-id', userId);
            console.log('👤 User ID set:', userId);
          } else {
            console.error('❌ User ID not found in localStorage or sessionStorage.');
          }
        });
        
        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
        });
        
        this.socket.on('error', (error) => {
          console.error('❌ Socket error:', error);
        });
        
        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Socket disconnected:', reason);
        });
        
      } else {
        console.error('❌ No se pudo obtener el userId para inicializar el socket');
      }
    } catch (error) {
      console.error('❌ Error initializing Socket.IO:', error);
    }
  }

  onPermissionChange(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('permissions-updated', (data) => {
        observer.next(data);
      });
    });
  }

  onRoleChange(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('role-updated', (data) => {
        //  console.log("SE ACTUALIZO EL ROL");
        observer.next(data);
      });
    });
  }
  onNotification(): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        // Escuchar ambos eventos para compatibilidad
        this.socket.on('notification', (data) => {
          console.log('🔔 Notificación masiva recibida en frontend:', data);
          observer.next(data);
        });
        
        this.socket.on('notified-user', (data) => {
          console.log('🔔 Notificación recibida en frontend (masiva o personalizada):', data);
          observer.next(data);
        });
      } else {
        console.error('❌ Socket no está inicializado');
      }
    });
  }

  // Método para enviar notificaciones a un usuario específico
  public notifyUser(userId: string, data: any): void {
    console.log('Notify User', userId, data)
    this.socket.emit('notify-user', { userId, data });
  }
}