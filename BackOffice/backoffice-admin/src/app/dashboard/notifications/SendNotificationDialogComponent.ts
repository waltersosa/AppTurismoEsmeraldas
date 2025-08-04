import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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

export interface SendNotificationDialogData {
  notification: Notification;
}

@Component({
  selector: 'app-send-notification-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title>Enviar Notificación</h2>
    <mat-dialog-content>
      <p>¿Quieres enviar la notificación "<strong>{{ data.notification.title }}</strong>" a todos los usuarios o a un usuario específico?</p>

      <div style="margin:20px 0;">
        <button mat-raised-button color="primary" (click)="sendToAll()" style="width: 100%; margin-bottom: 12px;">
          Enviar a Todos
        </button>

        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>ID de usuario específico</mat-label>
          <input matInput [(ngModel)]="specificUserId" placeholder="Ingresa el ID del usuario" />
        </mat-form-field>
        <button mat-raised-button color="accent" (click)="sendToSpecific()" [disabled]="!specificUserId || specificUserId.trim() === ''" style="width: 100%;">
          Enviar a Usuario Específico
        </button>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
    </mat-dialog-actions>
  `
})
export class SendNotificationDialogComponent {
  specificUserId: string = '';

  constructor(
    public dialogRef: MatDialogRef<SendNotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendNotificationDialogData
  ) {}

  sendToAll() {
    this.dialogRef.close({ sendTo: 'all' });
  }

  sendToSpecific() {
    if (this.specificUserId && this.specificUserId.trim() !== '') {
      this.dialogRef.close({ sendTo: 'specific', specificUserId: this.specificUserId.trim() });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
