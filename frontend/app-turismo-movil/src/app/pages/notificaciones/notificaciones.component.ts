import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from './../../services/socket.io.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MenuInferiorComponent } from '../menu-inferior/menu-inferior.component';

interface Notificacion {
  titulo: string;
  mensaje: string;
  fecha: Date;
  leida?: boolean;
  id?: string;
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  templateUrl: './notificaciones.component.html',
  imports: [CommonModule, HttpClientModule, MenuInferiorComponent],
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
  isLoading: boolean = false;

  constructor(
    private socketService: SocketService, 
    private router: Router, 
    private http: HttpClient
  ) {
    this.getPersistentNotification();
  }

  ngOnInit(): void {
    // Inicializa la conexión socket
    this.socketService.inicializador();

    // Se suscribe a las notificaciones entrantes
    this.notificationSub = this.socketService.onNotification().subscribe(
      (data: any) => {
        if (data) {
          console.log('Nueva notificación recibida:', data);
          const nuevaNotificacion: Notificacion = {
            id: data.id || Date.now().toString(),
            titulo: data.titulo || 'Sin título',
            mensaje: data.mensaje || 'Sin mensaje',
            fecha: new Date(data.fecha || new Date()),
            leida: false
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

  trackByNotificacion(index: number, notificacion: Notificacion): string {
    return notificacion.id || index.toString();
  }

  formatearFecha(fecha: Date): string {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 1) {
      return 'Ahora mismo';
    } else if (minutos < 60) {
      return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    } else if (horas < 24) {
      return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    } else if (dias < 7) {
      return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    } else {
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const anio = fecha.getFullYear();
      return `${dia}/${mes}/${anio}`;
    }
  }

  ngOnDestroy(): void {
    // Evita memory leaks cancelando la suscripción al destruir el componente
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  getPersistentNotification() {
    this.isLoading = true;
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('Error al recuperar la identidad del usuario');
      this.isLoading = false;
      return;
    }

    // Traemos las notificaciones de la base de datos
    this.http.get<any>(`http://localhost:3001/notifications/sentNotifications/${userId}`).subscribe({
      next: (resp) => {
        console.log('Notificaciones cargadas:', resp);
        
        if (resp.data && Array.isArray(resp.data)) {
          const nuevasNotificaciones: Notificacion[] = resp.data.map((item: any) => ({
            id: item.id || item._id || Date.now().toString(),
            titulo: item.title || item.titulo || 'Sin título',
            mensaje: item.message || item.mensaje || 'Sin mensaje',
            fecha: new Date(item.createdAt || item.fecha || new Date()),
            leida: item.leida || false
          }));

          this.notificaciones = nuevasNotificaciones;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al recuperar las notificaciones', err);
        this.isLoading = false;
      }
    });
  }

  returnHome() {
    this.router.navigate(['/home']);
  }

  marcarComoLeida(notificacion: Notificacion) {
    notificacion.leida = true;
    // Aquí podrías hacer una llamada al backend para marcar como leída
    console.log('Notificación marcada como leída:', notificacion);
  }
}
