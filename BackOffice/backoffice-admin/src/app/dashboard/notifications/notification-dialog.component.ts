import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

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

export interface NotificationDialogData {
  notification?: Notification;
  isEdit?: boolean;
}

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
  ],
  template: `
    <div class="notification-dialog">
      <h2 mat-dialog-title>
        <mat-icon>{{ data.isEdit ? 'edit' : 'add' }}</mat-icon>
        {{ data.isEdit ? 'Editar' : 'Crear' }} Notificación
      </h2>
      
      <mat-dialog-content>
        <form #form="ngForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Título</mat-label>
            <input matInput required [(ngModel)]="notification.title" name="title" #title="ngModel" 
                   placeholder="Ingrese el título de la notificación">
            <mat-error *ngIf="title.invalid && (title.dirty || title.touched)">
              El título es obligatorio
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mensaje</mat-label>
            <textarea matInput rows="4" required [(ngModel)]="notification.message" name="message" 
                      #message="ngModel" placeholder="Ingrese el mensaje de la notificación"></textarea>
            <mat-error *ngIf="message.invalid && (message.dirty || message.touched)">
              El mensaje es obligatorio
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Tipo</mat-label>
            <mat-select [(ngModel)]="notification.type" name="type">
              <mat-option value="info">
                <mat-icon>info</mat-icon> Info
              </mat-option>
              <mat-option value="alert">
                <mat-icon>warning</mat-icon> Alert
              </mat-option>
              <mat-option value="review">
                <mat-icon>rate_review</mat-icon> Review
              </mat-option>
            </mat-select>
          </mat-form-field>

          <div class="send-options">
            <h3>Opciones de Envío</h3>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Enviar a</mat-label>
              <mat-select [(ngModel)]="sendTo" name="sendTo">
                <mat-option value="all">
                  <mat-icon>group</mat-icon> Todos los usuarios
                </mat-option>
                <mat-option value="specific">
                  <mat-icon>person</mat-icon> Usuario específico
                </mat-option>
                <mat-option value="save">
                  <mat-icon>save</mat-icon> Solo guardar (no enviar)
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field *ngIf="sendTo === 'specific'" appearance="outline" class="full-width">
              <mat-label>ID del usuario</mat-label>
              <input matInput [(ngModel)]="specificUserId" name="specificUserId" 
                     placeholder="Ingrese el ID del usuario">
            </mat-form-field>
          </div>

          <div class="preview" *ngIf="notification.title || notification.message">
            <h3>Vista Previa</h3>
            <div class="preview-card">
              <div class="preview-header">
                <mat-icon>{{ getTypeIcon(notification.type) }}</mat-icon>
                <span class="preview-title">{{ notification.title || 'Título de ejemplo' }}</span>
              </div>
              <p class="preview-message">{{ notification.message || 'Mensaje de ejemplo' }}</p>
              <div class="preview-meta">
                <mat-chip [color]="getTypeColor(notification.type)" selected>
                  {{ notification.type || 'info' }}
                </mat-chip>
                <span class="preview-time">Ahora</span>
              </div>
            </div>
          </div>
        </form>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          <mat-icon>close</mat-icon> Cancelar
        </button>
        <button mat-raised-button color="primary" (click)="onSubmit()" 
                [disabled]="form.invalid || isSubmitting">
          <mat-icon>{{ getSubmitIcon() }}</mat-icon>
          {{ getSubmitText() }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .notification-dialog {
      min-width: 500px;
      max-width: 600px;
      font-family: 'Roboto', sans-serif;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
      position: relative;
      z-index: 1;
    }

    h2 mat-dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      color: #333;
      font-weight: 500;
    }

    /* Arreglar superposición de texto en campos de formulario */
    mat-form-field {
      position: relative;
      z-index: 1;
    }

    mat-form-field input,
    mat-form-field textarea {
      font-size: 14px !important;
      line-height: 1.4 !important;
      font-family: 'Roboto', sans-serif !important;
    }

    mat-form-field mat-label {
      font-size: 14px !important;
      font-weight: 500 !important;
      color: rgba(0, 0, 0, 0.87) !important;
    }

    mat-form-field .mat-mdc-form-field-subscript-wrapper {
      position: relative;
      z-index: 2;
    }

    mat-form-field .mat-mdc-text-field-wrapper {
      position: relative;
      z-index: 1;
    }

    mat-form-field .mat-mdc-form-field-focus-overlay {
      position: relative;
      z-index: 1;
    }

    /* Arreglar placeholder */
    mat-form-field input::placeholder,
    mat-form-field textarea::placeholder {
      color: rgba(0, 0, 0, 0.38) !important;
      font-size: 14px !important;
      font-family: 'Roboto', sans-serif !important;
    }

    /* Arreglar errores */
    mat-form-field .mat-mdc-form-field-error-wrapper {
      position: relative;
      z-index: 3;
    }

    mat-form-field .mat-mdc-form-field-error {
      font-size: 12px !important;
      color: #f44336 !important;
      font-weight: 500 !important;
    }

    .send-options {
      margin: 20px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      position: relative;
      z-index: 1;
    }

    .send-options h3 {
      margin: 0 0 16px 0;
      font-size: 1.1em;
      color: #333;
      font-weight: 500;
    }

    .preview {
      margin-top: 20px;
      position: relative;
      z-index: 1;
    }

    .preview h3 {
      margin: 0 0 12px 0;
      font-size: 1em;
      color: #666;
      font-weight: 500;
    }

    .preview-card {
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .preview-title {
      font-weight: 500;
      font-size: 1.1em;
      color: #333;
    }

    .preview-message {
      margin: 0 0 12px 0;
      color: #666;
      line-height: 1.4;
      font-size: 14px;
    }

    .preview-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview-time {
      font-size: 0.85em;
      color: #999;
    }

    mat-dialog-actions {
      padding: 16px 0 0 0;
      margin: 0;
      position: relative;
      z-index: 1;
    }

    mat-dialog-actions button {
      position: relative;
      z-index: 1;
    }

    /* Arreglar chips */
    mat-chip {
      font-size: 12px !important;
      font-weight: 500 !important;
      text-shadow: none !important;
    }

    /* Arreglar select */
    mat-select {
      font-size: 14px !important;
      font-family: 'Roboto', sans-serif !important;
    }

    mat-option {
      font-size: 14px !important;
      font-family: 'Roboto', sans-serif !important;
    }

    /* Arreglar iconos en opciones */
    mat-option mat-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      margin-right: 8px !important;
    }

    /* Arreglar diálogo overlay */
    .cdk-overlay-pane {
      position: relative;
      z-index: 1000;
    }

    .mat-mdc-dialog-container {
      position: relative;
      z-index: 1001;
    }

    @media (max-width: 600px) {
      .notification-dialog {
        min-width: auto;
        width: 100%;
        margin: 16px;
      }
    }
  `]
})
export class NotificationDialogComponent {
  notification: Notification;
  sendTo: string = 'all';
  specificUserId: string = '';
  isSubmitting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationDialogData,
    private snackBar: MatSnackBar
  ) {
    this.notification = data.notification ? { ...data.notification } : {
      title: '',
      message: '',
      type: 'info',
      data: {},
      read: false,
      sent: false
    };
  }

  getTypeIcon(type: string = 'info'): string {
    switch (type) {
      case 'alert': return 'warning';
      case 'review': return 'rate_review';
      default: return 'info';
    }
  }

  getTypeColor(type: string = 'info'): string {
    switch (type) {
      case 'alert': return 'warn';
      case 'review': return 'accent';
      default: return 'primary';
    }
  }

  getSubmitIcon(): string {
    if (this.sendTo === 'save') return 'save';
    return this.data.isEdit ? 'edit' : 'send';
  }

  getSubmitText(): string {
    if (this.sendTo === 'save') return 'Guardar';
    return this.data.isEdit ? 'Actualizar' : 'Crear y Enviar';
  }

  onSubmit(): void {
    if (!this.notification.title || !this.notification.message) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    // Preparar datos para enviar
    const result = {
      ...this.notification,
      sendTo: this.sendTo,
      specificUserId: this.specificUserId
    };

    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 