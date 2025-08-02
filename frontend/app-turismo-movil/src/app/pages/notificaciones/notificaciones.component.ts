/*import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationSocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class NotificacionesComponent implements OnInit, OnDestroy {
  notificaciones: any[] = [];
  private notificationSub?: Subscription;

  constructor(private notificationSocket: NotificationSocketService) { }

  ngOnInit(): void {
    console.log('Inicializando NotificacionesComponent');
    const userId = localStorage.getItem('userId') || 'system'; // Asegúrate que tienes un userId
    this.notificationSocket.connect(userId);

    console.log('Conectando al socket de notificaciones para el usuario:', userId);
    // Escuchamos notificaciones generales
    this.notificationSub = this.notificationSocket.onNotification().subscribe((notif) => {
      console.log('Nueva notificación recibida:', notif);
      this.notificaciones.unshift(notif);

    });

    // Si el socket emite notificaciones individuales
    this.notificationSocket.onNotifiedUser().subscribe((notif) => {
      this.notificaciones.unshift(notif);
    });

  }

  ngOnDestroy(): void {
    this.notificationSub?.unsubscribe();
    this.notificationSocket.disconnect();
  }
}*/
// src/app/Componentes/notificaciones/notificaciones.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './../../services/socket.io.service' // Ajusta la ruta si es necesario
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';  // IMPORTANTE para *ngFor y otras directivas comunes
import { trigger, transition, style, animate } from '@angular/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router'
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Notificacion {
  titulo: string;
  mensaje: string;
  fecha: Date;
  // Puedes agregar más campos si es necesario
}


@Component({
  selector: 'app-notificaciones',
  standalone: true,
  templateUrl: './notificaciones.component.html',
  imports: [CommonModule, HttpClientModule],
  styleUrls: ['./notificaciones.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
})
export class NotificacionesComponent implements OnInit, OnDestroy {
  notificaciones: Notificacion[] = [];
  private notificationSub!: Subscription;

  constructor(private socketService: SocketService, private router: Router, private http: HttpClient) {
    this.getPersistentNotification();
  }

  ngOnInit(): void {
    // Inicializa la conexión socket
    this.socketService.inicializador();

    // Se suscribe a las notificaciones entrantes
    this.notificationSub = this.socketService.onNotification().subscribe(
      (data: any) => {
        if (data) {
          // Asumiendo que data tiene las propiedades titulo y mensaje

          console.log(data)
          const nuevaNotificacion: Notificacion = {
            titulo: data.titulo || 'Sin título',
            mensaje: data.mensaje || 'Sin mensaje',
            fecha: new Date(data.fecha)
          };

          // Agrega la notificación al arreglo para mostrar en pantalla
          this.notificaciones.unshift(nuevaNotificacion);
        }
      },
      (error) => {
        console.error('Error en la suscripción a notificaciones:', error);
      }
    );
  }

  formatearFecha(fecha: Date): string {
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${horas}:${minutos} - ${dia}/${mes}/${anio}`;
  }

  ngOnDestroy(): void {
    // Evita memory leaks cancelando la suscripción al destruir el componente
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  getPersistentNotification() {
    const userId = localStorage.getItem('userId');
    console.log(userId);
    if (!userId) {
      console.error('Error al recuperar la identidad del usuario');
      return
    }

    //Traemos las notificaciones de la base de datos.
    this.http.get<any>(`http://localhost:3001/notifications/user/${userId}`).subscribe({
      next: (resp) => {
        console.log(resp.data[0].title);

        const nuevasNotificaciones: Notificacion[] = resp.data.map((item: any) => ({
          titulo: item.title,
          mensaje: item.message,
          fecha: new Date(item.createdAt)
        }));

        this.notificaciones.unshift(...nuevasNotificaciones);
      },
      error: (err) => {
        console.error('Error al recuperar las notificaciones', err);
      }
    })

  }

  returnHome() {
    this.router.navigate(['/home']);
  }

}
