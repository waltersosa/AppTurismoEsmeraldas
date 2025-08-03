import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private isInitialized = false;

  constructor(private http: HttpClient) {
    this.inicializador();
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
        sessionStorage.getItem('userId') ||
        'admin'; // Usar 'admin' como fallback para BackOffice

      console.log('Inicializando socket con userId:', userId);

      this.socket = io('https://geoapi.esmeraldas.gob.ec', {
        path: '/new/socket.io',
        transports: ['websocket', 'polling'], // Agregar polling como fallback
        timeout: 10000, // Timeout de 10 segundos
        forceNew: true // Forzar nueva conexión
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.connected);
        this.isInitialized = true;

        if (userId) {
          this.socket.emit('set-user-id', userId);
          console.log('✅ User ID set:', userId);
        } else {
          console.error('❌ User ID not found');
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        this.isInitialized = false;
        
        // Intentar reconectar después de 5 segundos
        setTimeout(() => {
          console.log('🔄 Intentando reconectar...');
          this.inicializador();
        }, 5000);
      });

      this.socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
        this.isInitialized = false;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
        this.isInitialized = false;
        
        // Si no fue una desconexión voluntaria, intentar reconectar
        if (reason !== 'io client disconnect') {
          setTimeout(() => {
            console.log('🔄 Intentando reconectar después de desconexión...');
            this.inicializador();
          }, 3000);
        }
      });

      // Timeout para marcar como no inicializado si no se conecta en 10 segundos
      setTimeout(() => {
        if (!this.isInitialized) {
          console.warn('⚠️ Socket no se conectó en 10 segundos');
        }
      }, 10000);

    } catch (error) {
      console.error('❌ Error initializing Socket.IO:', error);
      this.isInitialized = false;
    }
  }

  onPermissionChange(): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('permissions-updated', (data) => {
          observer.next(data);
        });
      }
    });
  }

  onRoleChange(): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('role-updated', (data) => {
          //  console.log("SE ACTUALIZO EL ROL");
          observer.next(data);
        });
      }
    });
  }

  onNotification(): Observable<any> {
    return new Observable((observer) => {
      if (this.socket) {
        this.socket.on('notification', (data) => {
          observer.next(data);
        });
      }
    });
  }

  // Método para enviar notificaciones a un usuario específico
  public notifyUser(userId: string, data: any): void {
    console.log('📤 Notify User', userId, data);
    
    // Validar que los datos no sean undefined
    if (!data.titulo || !data.mensaje) {
      console.error('❌ Datos de notificación incompletos:', data);
      return;
    }
    
    if (!this.socket || !this.isInitialized) {
      console.error('❌ Socket no está inicializado. Intentando inicializar...');
      this.inicializador();
      
      // Esperar un poco y reintentar
      setTimeout(() => {
        if (this.socket && this.isInitialized) {
          this.socket.emit('notify-user', { userId, data });
          console.log('✅ Notificación enviada después de reintento');
        } else {
          console.error('❌ No se pudo inicializar el socket después de reintento');
          // Intentar una vez más después de 3 segundos
          setTimeout(() => {
            if (this.socket && this.isInitialized) {
              this.socket.emit('notify-user', { userId, data });
              console.log('✅ Notificación enviada en segundo reintento');
            } else {
              console.error('❌ Socket definitivamente no disponible');
            }
          }, 3000);
        }
      }, 2000);
      return;
    }

    try {
      this.socket.emit('notify-user', { userId, data });
      console.log('✅ Notificación enviada exitosamente');
    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
    }
  }

  public getUserNotifications(): Observable<any> {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
    
    // Si no hay userId, usar 'empty' en lugar de cadena vacía
    const finalUserId = userId || 'empty';
    const url = `http://localhost:3001/notifications/by-user/${finalUserId}`;
    return this.http.get<any>(url);
  }

  public createNotification(notificacion: any): Observable<any> {
    console.log('Hola soy la función createNotification, estos son los datos que estoy recibiendo', notificacion);
    const url = `http://localhost:3001/notifications/`;
    return this.http.post<any>(url, notificacion);
  }

  public getSocketStatus(): { connected: boolean, initialized: boolean } {
    return {
      connected: this.socket ? this.socket.connected : false,
      initialized: this.isInitialized
    };
  }

  public forceReconnect(): void {
    console.log('🔄 Forzando reconexión del socket...');
    if (this.socket) {
      this.socket.disconnect();
    }
    this.isInitialized = false;
    this.inicializador();
  }
}