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

interface Notificacion {
  titulo: string;
  mensaje: string;
  // Puedes agregar más campos si es necesario
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  templateUrl: './notificaciones.component.html',
  imports: [CommonModule],  // <-- ESTA LÍNEA FALTABA
  styleUrls: ['./notificaciones.component.css'] // Si tienes estilos específicos
})
export class NotificacionesComponent implements OnInit, OnDestroy {
  notificaciones: Notificacion[] = [];
  private notificationSub!: Subscription;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    // Inicializa la conexión socket
    this.socketService.inicializador();

    // Se suscribe a las notificaciones entrantes
    this.notificationSub = this.socketService.onNotification().subscribe(
      (data: any) => {
        if (data) {
          // Asumiendo que data tiene las propiedades titulo y mensaje
          const nuevaNotificacion: Notificacion = {
            titulo: data.titulo || 'Sin título',
            mensaje: data.mensaje || 'Sin mensaje'
          };

          // Agrega la notificación al arreglo para mostrar en pantalla
          this.notificaciones.push(nuevaNotificacion);
        }
      },
      (error) => {
        console.error('Error en la suscripción a notificaciones:', error);
      }
    );
  }

  ngOnDestroy(): void {
    // Evita memory leaks cancelando la suscripción al destruir el componente
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }
}
