import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  _id?: string;
  title: string;
  message: string;
  creadorId?: string;
  fechaCreacion?: string;
}

export interface NotificationsApiResponse {
  success: boolean;
  data: Notification[];
}


@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3006/notifications';

  getUserNotifications(userId: string): Observable<NotificationsApiResponse> {
    return this.http.get<NotificationsApiResponse>(`${this.baseUrl}/user/${userId}`);
  }

  // Método para crear una notificación (opcional)
  createNotification(notification: Notification): Observable<Notification> {
    return this.http.post<Notification>(this.baseUrl, notification);
  }
  
  //Metodo para enviar las notificaciones a los usuarios.
  sendNotification(notificationId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send/${notificationId}`, {});
  }


}
