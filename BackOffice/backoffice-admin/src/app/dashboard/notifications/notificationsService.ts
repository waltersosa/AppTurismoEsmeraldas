import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor(private http: HttpClient) {
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

      if (userId) {
        this.socket = io('https://geoapi.esmeraldas.gob.ec', {
          path: '/new/socket.io',
        });

        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket.connected);

          if (userId) {
            this.socket.emit('set-user-id', userId);
            const userid = localStorage.getItem('userId') || sessionStorage.getItem('userId') || '';
            //  this.notifyUser(userid, { titulo: "BUenas tardes", mensaje: "XD" });
          } else {
            console.error(
              'User ID not found in localStorage or sessionStorage.'
            );
          }
        });
        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
        });
      }
    } catch (error) {
      console.error('Error initializing Socket.IO:', error);
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
      this.socket.on('notification', (data) => {
        observer.next(data);
      });
    });
  }

  // Método para enviar notificaciones a un usuario específico
  public notifyUser(userId: string, data: any): void {
    console.log('Notify User', userId, data)
    this.socket.emit('notify-user', { userId, data });
  }

  public getUserNotifications(): Observable<any> {
    const url = `http://localhost:3001/notifications/null/`;
    return this.http.get<any>(url);
  }

  public createNotification(notificacion: any): Observable<any> {
    console.log('Hola soy la función createNotification, estos son los datos que estoy recibiendo', notificacion)
    const url = `http://localhost:3001/notifications/`;
    return this.http.post<any>(url, notificacion);
  }

  
}