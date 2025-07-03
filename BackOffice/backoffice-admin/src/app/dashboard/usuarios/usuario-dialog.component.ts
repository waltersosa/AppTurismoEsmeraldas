import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

export interface UsuarioDialogData {
  user?: any;
  editMode: boolean;
}

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.editMode ? 'Editar Usuario' : 'Agregar Usuario' }}</h2>
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form-modal">
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" required />
      </mat-form-field>
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Correo</mat-label>
        <input matInput formControlName="correo" required type="email" />
      </mat-form-field>
      <ng-container *ngIf="!data.editMode">
        <mat-form-field appearance="outline" color="primary">
          <mat-label>Contraseña</mat-label>
          <input matInput formControlName="contraseña" required type="password" />
        </mat-form-field>
      </ng-container>
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Rol</mat-label>
        <input matInput formControlName="rol" required />
      </mat-form-field>
      <div class="modal-actions">
        <button mat-raised-button color="primary" type="submit">{{ data.editMode ? 'Actualizar' : 'Agregar' }}</button>
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    .user-form-modal { display: flex; flex-direction: column; gap: 18px; min-width: 320px; max-width: 400px; margin: 0 auto; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 12px; }
    ::ng-deep .user-form-modal .mat-form-field-label {
      color: #111 !important;
    }
    ::ng-deep .user-form-modal .mat-input-element {
      color: #111 !important;
      background: #fff !important;
    }
    ::ng-deep .user-form-modal input {
      color: #111 !important;
      background: #fff !important;
    }
    ::ng-deep .user-form-modal .mat-form-field-underline {
      background-color: #111 !important;
    }
    ::ng-deep .user-form-modal .mat-form-field-flex {
      background: #fff !important;
    }
  `]
})
export class UsuarioDialogComponent {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDialogData
  ) {
    this.userForm = this.fb.group({
      nombre: [data.user?.nombre || '', Validators.required],
      correo: [data.user?.correo || '', [Validators.required, Validators.email]],
      contraseña: ['', data.editMode ? [] : [Validators.required]],
      rol: [data.user?.rol || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    this.dialogRef.close(this.userForm.value);
  }

  onCancel() {
    this.dialogRef.close(null);
  }
} 