import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, User } from '../../auth/auth.service';
import { SocketService } from './notificationsService';
import { ConfirmationService } from '../../services/confirmation.service';
import { NotificationDialogComponent } from './notification-dialog.component';
import { SendNotificationDialogComponent } from './SendNotificationDialogComponent';

export interface Notification {
  _id?: string;
  title: string;
  message: string;
  userId?: string;
  fechaCreacion?: string;
  type?: string;
  data?: any;
  read?: boolean;
  sent?: boolean;
}

export interface NotificationStats {
  total: number;
  sent: number;
  pending: number;
  read: number;
  unread: number;
}

@Component({
  selector: 'app-notifications',
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
    MatOptionModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  template: `
    <div class="notifications-container">
      <!-- Header -->
      <div class="header">
        <div class="header-left">
          <h1>📢 Gestión de Notificaciones</h1>
          <div class="socket-status">
            <span class="status-indicator" 
                  [class.connected]="socketService.getSocketStatus().connected"
                  [class.disconnected]="!socketService.getSocketStatus().connected">
              {{ socketService.getSocketStatus().connected ? '🟢 Conectado' : '🔴 Desconectado' }}
            </span>
          </div>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> Crear Notificación
          </button>
          <button mat-raised-button color="accent" (click)="openTemplatesDialog()">
            <mat-icon>library_books</mat-icon> Plantillas
          </button>
          <button mat-raised-button color="warn" (click)="reconnectSocket()" 
                  [disabled]="socketService.getSocketStatus().connected">
            <mat-icon>refresh</mat-icon> Reconectar Socket
          </button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon total">
                <mat-icon>notifications</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.total }}</h3>
                <p>Total</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon sent">
                <mat-icon>send</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.sent }}</h3>
                <p>Enviadas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon pending">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.pending }}</h3>
                <p>Pendientes</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon unread">
                <mat-icon>mark_email_unread</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.unread }}</h3>
                <p>No leídas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Filters -->
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>🔍 Buscar</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Buscar por título o mensaje...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select [(ngModel)]="selectedType">
            <mat-option value="">Todos</mat-option>
            <mat-option value="info">Info</mat-option>
            <mat-option value="alert">Alert</mat-option>
            <mat-option value="review">Review</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [(ngModel)]="selectedStatus">
            <mat-option value="">Todos</mat-option>
            <mat-option value="sent">Enviadas</mat-option>
            <mat-option value="pending">Pendientes</mat-option>
            <mat-option value="read">Leídas</mat-option>
            <mat-option value="unread">No leídas</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Notifications List -->
      <div class="notifications-list">
        <div *ngIf="filteredNotifications.length === 0" class="no-notifications">
          <mat-icon>notifications_off</mat-icon>
          <h3>No hay notificaciones</h3>
          <p>No se encontraron notificaciones con los filtros aplicados</p>
        </div>

        <mat-card *ngFor="let notification of filteredNotifications" class="notification-card">
          <mat-card-content>
            <div class="notification-header">
              <div class="notification-info">
                <h3>{{ notification.title }}</h3>
                <p class="notification-message">{{ notification.message }}</p>
                <div class="notification-meta">
                  <mat-chip-set>
                    <mat-chip [color]="getTypeColor(notification.type)" selected>
                      {{ notification.type || 'info' }}
                    </mat-chip>
                    <mat-chip [color]="notification.sent ? 'primary' : 'warn'" selected>
                      {{ notification.sent ? 'Enviada' : 'Pendiente' }}
                    </mat-chip>
                    <mat-chip [color]="notification.read ? 'accent' : 'primary'" selected>
                      {{ notification.read ? 'Leída' : 'No leída' }}
                    </mat-chip>
                  </mat-chip-set>
                  <span class="notification-date">
                    {{ formatDate(notification.fechaCreacion) }}
                  </span>
                </div>
              </div>
              
              <div class="notification-actions">

                <button mat-raised-button color="primary" 
                          (click)="sendNotification(notification)" 
                          *ngIf="!notification.sent">
                    <mat-icon>send</mat-icon> Enviar
                  </button>

                <button mat-icon-button [matMenuTriggerFor]="menu" matTooltip="Acciones">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="toggleReadStatus(notification)">
                    <mat-icon>{{ notification.read ? 'mark_email_unread' : 'mark_email_read' }}</mat-icon>
                    {{ notification.read ? 'Marcar como no leída' : 'Marcar como leída' }}
                  </button>
                  <button mat-menu-item (click)="editNotification(notification)" *ngIf="!notification.sent">
                    <mat-icon>edit</mat-icon>
                    Editar
                  </button>
                  <button mat-menu-item (click)="sendNotification(notification)" *ngIf="!notification.sent">
                    <mat-icon>send</mat-icon>
                    Enviar
                  </button>
                  <button mat-menu-item (click)="resendNotification(notification)" *ngIf="notification.sent">
                    <mat-icon>refresh</mat-icon>
                    Reenviar
                  </button>
                  <button mat-menu-item (click)="deleteNotification(notification)">
                    <mat-icon>delete</mat-icon>
                    Eliminar
                  </button>
                </mat-menu>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Roboto', sans-serif;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;
      border-radius: 8px;
      position: relative;
      z-index: 1;
    }

    .header h1 {
      margin: 0;
      font-size: 2em;
      font-weight: 300;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .socket-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9em;
      font-weight: 500;
    }

    .status-indicator {
      padding: 6px 12px;
      border-radius: 16px;
      font-weight: bold;
      text-shadow: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .status-indicator.connected {
      background-color: #4caf50;
      color: white;
    }

    .status-indicator.disconnected {
      background-color: #f44336;
      color: white;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      transition: transform 0.2s ease;
      position: relative;
      z-index: 1;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-icon.total { background: linear-gradient(135deg, #4caf50, #66bb6a); }
    .stat-icon.sent { background: linear-gradient(135deg, #2196f3, #42a5f5); }
    .stat-icon.pending { background: linear-gradient(135deg, #ff9800, #ffb74d); }
    .stat-icon.unread { background: linear-gradient(135deg, #f44336, #ef5350); }

    .stat-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 1.8em;
      font-weight: 500;
      color: #333;
    }

    .stat-info p {
      margin: 0;
      opacity: 0.8;
      font-size: 0.9em;
      color: #666;
    }

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    }

    .filters mat-form-field {
      min-width: 200px;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      position: relative;
      z-index: 1;
    }

    .notification-card {
      transition: box-shadow 0.2s ease;
      position: relative;
      z-index: 1;
    }

    .notification-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 15px;
    }

    .notification-info {
      flex: 1;
      min-width: 0;
    }

    .notification-info h3 {
      margin: 0 0 8px 0;
      font-size: 1.2em;
      font-weight: 500;
      color: #333;
      line-height: 1.3;
    }

    .notification-message {
      margin: 0 0 12px 0;
      color: #666;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .notification-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .notification-date {
      font-size: 0.85em;
      color: #999;
      white-space: nowrap;
    }

    .notification-actions {
      margin-left: 15px;
      flex-shrink: 0;
    }

    .no-notifications {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-notifications mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }

    .no-notifications h3 {
      margin: 0 0 10px 0;
      font-weight: 300;
      color: #333;
    }

    .no-notifications p {
      margin: 0;
      opacity: 0.8;
      color: #666;
    }

    /* Mejorar la legibilidad de los chips */
    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    mat-chip {
      font-size: 0.85em !important;
      font-weight: 500 !important;
      text-shadow: none !important;
    }

    /* Mejorar los campos de formulario */
    mat-form-field {
      position: relative;
      z-index: 1;
    }

    mat-form-field input,
    mat-form-field textarea {
      font-size: 14px !important;
      line-height: 1.4 !important;
    }

    /* Mejorar los botones */
    button {
      position: relative;
      z-index: 1;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .header-left {
        flex-direction: column;
        align-items: center;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
      }

      .filters {
        flex-direction: column;
      }

      .filters mat-form-field {
        min-width: auto;
      }

      .notification-meta {
        flex-direction: column;
        align-items: flex-start;
      }

      .notification-header {
        flex-direction: column;
        gap: 10px;
      }

      .notification-actions {
        margin-left: 0;
        align-self: flex-end;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  currentUser: User | null = null;
  notificaciones: Notification[] = [];
  nuevaNotificacion: Notification = { title: '', message: '' };
  userId: string = '';
  notificacionSeleccionada: Notification | null = null;

  // Filtros
  searchTerm: string = '';
  selectedType: string = '';
  selectedStatus: string = '';

  // Estadísticas
  stats: NotificationStats = {
    total: 0,
    sent: 0,
    pending: 0,
    read: 0,
    unread: 0
  };

  constructor(
    private authService: AuthService,
    public socketService: SocketService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.cargarNotificaciones();
    }
  }

  get filteredNotifications(): Notification[] {
    return this.notificaciones.filter(notification => {
      const matchesSearch = !this.searchTerm ||
        notification.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = !this.selectedType || notification.type === this.selectedType;

      const matchesStatus = !this.selectedStatus ||
        (this.selectedStatus === 'sent' && notification.sent) ||
        (this.selectedStatus === 'pending' && !notification.sent) ||
        (this.selectedStatus === 'read' && notification.read) ||
        (this.selectedStatus === 'unread' && !notification.read);

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  cargarNotificaciones() {
    this.socketService.getUserNotifications().subscribe({
      next: (response) => {
        this.notificaciones = response.data || [];
        this.updateStats();
      },
      error: (error) => {
        console.error('❌ Error al cargar notificaciones:', error);
        this.snackBar.open('Error al cargar notificaciones', 'Cerrar', { duration: 3000 });
      }
    });
  }

  updateStats() {
    this.stats = {
      total: this.notificaciones.length,
      sent: this.notificaciones.filter(n => n.sent).length,
      pending: this.notificaciones.filter(n => !n.sent).length,
      read: this.notificaciones.filter(n => n.read).length,
      unread: this.notificaciones.filter(n => !n.read).length
    };
  }

  getTypeColor(type: string = 'info'): string {
    switch (type) {
      case 'alert': return 'warn';
      case 'review': return 'accent';
      default: return 'primary';
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      data: {
        notification: null,
        isEdit: false
      },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleNotificationResult(result);
      }
    });
  }

  openTemplatesDialog() {
    // TODO: Implementar modal de plantillas
    this.snackBar.open('Funcionalidad en desarrollo', 'Cerrar', { duration: 2000 });
  }

  toggleReadStatus(notification: Notification) {
    // TODO: Implementar cambio de estado en el backend
    // Por ahora solo cambiar localmente
    notification.read = !notification.read;
    this.updateStats();
    this.snackBar.open(
      `Notificación marcada como ${notification.read ? 'leída' : 'no leída'}`,
      'Cerrar',
      { duration: 2000 }
    );
  }

  editNotification(notification: Notification) {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      data: {
        notification: notification,
        isEdit: true
      },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleNotificationResult(result);
      }
    });
  }

  handleNotificationResult(result: any) {
    const { sendTo, specificUserId, ...notificationData } = result;

    // Crear la notificación base
    const notification = {
      ...notificationData,
      userId: null, // Notificaciones administrativas
      fechaCreacion: new Date().toISOString(),
      data: {},
      read: false,
      sent: false
    };

    console.log('Creando notificación:', notification);

    // Guardar la notificación
    this.socketService.createNotification(notification).subscribe({
      next: (savedNotification) => {
        console.log('Notificación guardada:', savedNotification);
        this.snackBar.open('Notificación guardada exitosamente', 'Cerrar', { duration: 2000 });

        // Si se debe enviar, enviar la notificación
        if (sendTo !== 'save') {
          this.sendNotificationToUsers(savedNotification, sendTo, specificUserId);
        }

        this.cargarNotificaciones();
      },
      error: (error) => {
        console.error('Error al guardar notificación:', error);
        this.snackBar.open('Error al guardar notificación', 'Cerrar', { duration: 3000 });
      }
    });
  }

  sendNotificationToUsers(notification: Notification, sendTo: string, specificUserId?: string) {
    // Asegurar que los datos no sean undefined
    const data = {
      titulo: (notification.data && notification.data.title) || notification.title || 'Notificación',
      mensaje: (notification.data && notification.data.message) || notification.message || 'Sin mensaje',
      type: (notification.data && notification.data.type) || notification.type || 'info',
      fecha: (notification.data && notification.data.fechaCreacion) || notification.fechaCreacion || new Date().toISOString(),
      extra: (notification.data && notification.data.extra) || {},
      sent: true
    };


    console.log('📤 Enviando notificación con datos:', data);
    console.log('🔌 Estado del socket:', this.socketService.getSocketStatus());

    try {
      if (sendTo === 'all') {
        // Enviar a todos los usuarios usando notifyAll
        this.socketService.notifyAll(data);
        this.snackBar.open('✅ Notificación enviada a todos los usuarios', 'Cerrar', { duration: 3000 });
      } else if (sendTo === 'specific' && specificUserId) {
        // Enviar a usuario específico
        this.socketService.notifyUser(specificUserId, data);
        this.snackBar.open(`✅ Notificación enviada al usuario ${specificUserId}`, 'Cerrar', { duration: 3000 });
      }

      this.updateStats();

    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
      this.snackBar.open('❌ Error al enviar notificación', 'Cerrar', { duration: 3000 });
    }
  }

  sendNotification(notification: Notification) {
    /*    this.confirmationService.confirm({
          title: 'Enviar Notificación',
          message: `¿Estás seguro de que quieres enviar "${notification.title}" a todos los usuarios?`,
          confirmText: 'Enviar',
          cancelText: 'Cancelar',
          type: 'info'
        }).subscribe(confirmed => {
          if (confirmed) {
            this.sendNotificationToUsers(notification, 'all');
          }
        });*/

    const dialogRef = this.dialog.open(SendNotificationDialogComponent, {
      width: '400px',
      data: { notification }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.sendTo === 'all') {
          this.sendNotificationToUsers(notification, 'all');
        } else if (result.sendTo === 'specific' && result.specificUserId) {
          this.sendNotificationToUsers(notification, 'specific', result.specificUserId);
        }
      }
    });
  }

  resendNotification(notification: Notification) {
    this.confirmationService.confirm({
      title: 'Reenviar Notificación',
      message: `¿Estás seguro de que quieres reenviar "${notification.title}" a todos los usuarios?`,
      confirmText: 'Reenviar',
      cancelText: 'Cancelar',
      type: 'info'
    }).subscribe(confirmed => {
      if (confirmed) {
        // Enviar por socket
        this.sendNotificationToUsers(notification, 'all');

        // También crear notificaciones individuales en la base de datos
        this.createIndividualNotifications(notification);

        this.snackBar.open('Notificación reenviada exitosamente a todos los usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Método para crear notificaciones individuales para todos los usuarios
  createIndividualNotifications(notification: Notification) {
    // Crear una nueva notificación administrativa que será procesada por el backend
    const adminNotification = {
      title: notification.title,
      message: notification.message,
      userId: null, // Notificación administrativa
      type: notification.type || 'info',
      data: notification.data || {},
      read: false,
      sent: false
    };

    this.socketService.createNotification(adminNotification).subscribe({
      next: (savedNotification) => {
        console.log('✅ Notificación administrativa creada para reenvío:', savedNotification);

        // Ahora enviar la notificación usando el endpoint del backend
        this.http.post(`http://localhost:3001/notifications/send/${savedNotification._id}`, {}).subscribe({
          next: (response: any) => {
            console.log('✅ Notificación reenviada exitosamente:', response);
          },
          error: (error: any) => {
            console.error('❌ Error al reenviar notificación:', error);
            this.snackBar.open('Error al reenviar notificación', 'Cerrar', { duration: 3000 });
          }
        });
      },
      error: (error) => {
        console.error('❌ Error al crear notificación administrativa:', error);
        this.snackBar.open('Error al crear notificación administrativa', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteNotification(notification: Notification) {
    this.confirmationService.confirm({
      title: 'Eliminar Notificación',
      message: `¿Estás seguro de que quieres eliminar "${notification.title}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        // TODO: Implementar eliminación en el backend
        // Por ahora solo eliminar del array local
        this.notificaciones = this.notificaciones.filter(n => n._id !== notification._id);
        this.updateStats();
        this.snackBar.open('Notificación eliminada exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Métodos legacy para compatibilidad
  guardarNotificacion() {
    if (!this.currentUser) {
      this.snackBar.open('Usuario no autenticado', 'Cerrar', { duration: 3000 });
      return;
    }

    const nueva = {
      ...this.nuevaNotificacion,
      userId: null,
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
        this.cargarNotificaciones();
      },
      error: (error) => {
        console.error('Error al guardar notificación:', error);
        this.snackBar.open('Error al guardar notificación', 'Cerrar', { duration: 3000 });
      }
    });
  }

  enviarNotificacion() {
    if (!this.currentUser || !this.notificacionSeleccionada) {
      this.snackBar.open('No se puede enviar la notificación. Usuario o notificación no disponible.',
        'Cerrar', { duration: 3000 });
      return;
    }

    console.log('cara', this.userId)
    const data = {
      titulo: this.notificacionSeleccionada.title,
      mensaje: this.notificacionSeleccionada.message,
      type: this.notificacionSeleccionada.type || 'info',
      fecha: this.notificacionSeleccionada.fechaCreacion || new Date().toISOString(),
      extra: this.notificacionSeleccionada.data || {}
    };

    try {
      this.socketService.notifyUser(this.userId, data);
      const dataconUserID = {
        title: this.notificacionSeleccionada.title,
        message: this.notificacionSeleccionada.message,
        userId: this.userId,
        fechaCreacion: new Date().toISOString(),
        type: this.notificacionSeleccionada.type || 'info',
        data: this.notificacionSeleccionada.data || {},
        read: this.notificacionSeleccionada.read || false
      };
      this.socketService.createNotification(dataconUserID).subscribe({
        next: (noti) => {
          this.notificacionSeleccionada = {
            title: '',
            message: '',
            userId: '',
            fechaCreacion: '',
            type: '',
            data: '',
            read: false
          }
        },
        error: (error) => {
          this.snackBar.open('Hubo un error al enviar la notificación', 'Cerrar', { duration: 4000 });
          console.error('Error al enviar la notificación:', error);
        }
      });
      this.snackBar.open('Notificación enviada correctamente', 'Cerrar', { duration: 3000 });
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      this.snackBar.open('Error al enviar notificación', 'Cerrar', { duration: 3000 });
    }
  }

  reconnectSocket() {
    this.socketService.forceReconnect();
    this.snackBar.open('🔄 Reconectando socket...', 'Cerrar', { duration: 2000 });
  }
}
