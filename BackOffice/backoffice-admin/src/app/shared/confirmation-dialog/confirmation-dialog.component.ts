import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirmation-dialog">
      <div class="dialog-header" [ngClass]="'header-' + data.type">
        <mat-icon class="header-icon">
          {{ getIcon() }}
        </mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      
      <div mat-dialog-content class="dialog-content">
        <p class="message">{{ data.message }}</p>
      </div>
      
      <div mat-dialog-actions class="dialog-actions">
        <button 
          mat-button 
          [color]="getCancelColor()"
          (click)="onCancel()">
          {{ data.cancelText }}
        </button>
        <button 
          mat-raised-button 
          [color]="getConfirmColor()"
          (click)="onConfirm()">
          {{ data.confirmText }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      padding: 0;
    }
    
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .header-warning {
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
      border-bottom-color: #ffc107;
    }
    
    .header-danger {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      border-bottom-color: #dc3545;
    }
    
    .header-info {
      background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
      border-bottom-color: #17a2b8;
    }
    
    .header-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    
    .header-warning .header-icon {
      color: #856404;
    }
    
    .header-danger .header-icon {
      color: #721c24;
    }
    
    .header-info .header-icon {
      color: #0c5460;
    }
    
    h2[mat-dialog-title] {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .header-warning h2[mat-dialog-title] {
      color: #856404;
    }
    
    .header-danger h2[mat-dialog-title] {
      color: #721c24;
    }
    
    .header-info h2[mat-dialog-title] {
      color: #0c5460;
    }
    
    .dialog-content {
      padding: 20px 24px;
    }
    
    .message {
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
      color: #333;
    }
    
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px 20px 24px;
      margin: 0;
    }
    
    button {
      min-width: 100px;
      font-weight: 500;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  getIcon(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'help';
    }
  }

  getConfirmColor(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warn';
      case 'danger':
        return 'warn';
      case 'info':
        return 'primary';
      default:
        return 'primary';
    }
  }

  getCancelColor(): string {
    return 'basic';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 