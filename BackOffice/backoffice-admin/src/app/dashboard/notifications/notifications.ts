import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, User } from '../../auth/auth.service';
import { SocketService } from './notificationsService';
import { title } from 'process';

export interface Notification {
  _id?: string;
  title: string;
  message: string;
  userId?: string;
  fechaCreacion?: string;
  type?: string;
  data?: any;
  read?: boolean;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="notifications-container" style="max-width: 600px; margin: 20px auto;">
      <h2>Crear Notificación</h2>
      
      <form (ngSubmit)="guardarNotificacion()" #form="ngForm">
        <mat-form-field appearance="fill" class="full-width" style="margin-bottom: 16px;">
          <mat-label>Título</mat-label>
          <input matInput required [(ngModel)]="nuevaNotificacion.title" name="titulo" #titulo="ngModel" />
          <mat-error *ngIf="titulo.invalid && (titulo.dirty || titulo.touched)">El título es obligatorio</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width" style="margin-bottom: 16px;">
          <mat-label>Descripción</mat-label>
          <textarea matInput rows="4" required [(ngModel)]="nuevaNotificacion.message" name="descripcion" #desc="ngModel"></textarea>
          <mat-error *ngIf="desc.invalid && (desc.dirty || desc.touched)">La descripción es obligatoria</mat-error>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          <mat-icon>save</mat-icon> Guardar Notificación
        </button>
      </form>

      <h3 style="margin-top: 40px;">Envio de Notificaciones</h3>
      <p>Seleccione Una notificación para enviarla a todos los usuarios</p>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Seleccione una Notificación</mat-label>
        <mat-select [(value)]="notificacionSeleccionada">
          <mat-option *ngFor="let noti of notificaciones" [value]="noti">
            {{ noti.title }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    <h2>Detalles de la notificación</h2>

      <div *ngIf="notificacionSeleccionada" style="margin-top: 20px; padding: 16px; background:#eee; border-radius:4px;">
        <h4>{{ notificacionSeleccionada.title }}</h4>
        <p>{{ notificacionSeleccionada.message }}</p>
      </div>
      

        <!-- Botón para enviar la notificación seleccionada -->
      <div *ngIf="notificacionSeleccionada" style="margin-top: 16px;">
        <button mat-raised-button color="accent" (click)="enviarNotificacion(notificacionSeleccionada._id!)">
          <mat-icon>send</mat-icon> Enviar Notificación
        </button>
      </div>

          </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class NotificationsComponent implements OnInit {




  currentUser: User | null = null;

  notificaciones: Notification[] = [];

  nuevaNotificacion: Notification = { title: '', message: '' };

  notificacionSeleccionada: Notification | null = null;

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.socketService.inicializador();

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        console.log('Drama', user.id)
        this.cargarNotificaciones(user.id);
      }
    });
  }



  cargarNotificaciones(userId: string) {
    this.socketService.getUserNotifications(userId).subscribe({
      next: (response) => {
        console.log('Respuesta del backend', response)
        this.notificaciones = response.data || [];

      },
      error: (error) => {
        console.error('Error al cargar notificaciones:', error);
        this.snackBar.open('Error al cargar notificaciones', 'Cerrar', { duration: 3000 });
      }
    });
  }

  guardarNotificacion() {
    if (!this.currentUser) {
      this.snackBar.open('Usuario no autenticado', 'Cerrar', { duration: 3000 });
      return;
    }

    const nueva = {
      ...this.nuevaNotificacion,
      userId: this.currentUser.id,
      fechaCreacion: new Date().toISOString(),
      type: 'info',
      data: {},
      read: true,
    };

    this.socketService.createNotification(nueva).subscribe({
      next: (noti) => {
        this.snackBar.open('Notificación guardada', 'Cerrar', { duration: 2000 });
        this.notificaciones.push(noti);
        this.nuevaNotificacion = { title: '', message: '' };
        this.cargarNotificaciones(this.currentUser!.id);
      },
      error: (error) => {
        console.error('Error al guardar notificación:', error);
        this.snackBar.open('Error al guardar notificación', 'Cerrar', { duration: 3000 });
      }
    });
  }


  enviarNotificacion(notificationId: string) {
    if (!this.currentUser || !this.notificacionSeleccionada) {
      this.snackBar.open('No se puede enviar la notificación. Usuario o notificación no disponible.', 'Cerrar', { duration: 3000 });
      return;
    }

    //const userId = this.currentUser.id;
    const userId = '6888aebc8ba208fd9fbbd816'
    const data = {
      titulo: this.notificacionSeleccionada.title,
      mensaje: this.notificacionSeleccionada.message,
      type: this.notificacionSeleccionada.type || 'info',
      fecha: this.notificacionSeleccionada.fechaCreacion || new Date().toISOString(),
      extra: this.notificacionSeleccionada.data || {}
    };

    try {
      this.socketService.notifyUser(userId, data);
      this.snackBar.open('Notificación enviada correctamente', 'Cerrar', { duration: 3000 });
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      this.snackBar.open('Error al enviar notificación', 'Cerrar', { duration: 3000 });
    }
  }


}
