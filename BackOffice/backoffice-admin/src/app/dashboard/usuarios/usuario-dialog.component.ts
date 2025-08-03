import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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
    MatInputModule,
    MatSelectModule,
    MatOptionModule
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
          <mat-hint>Mínimo 6 caracteres, incluir mayúscula, minúscula y número</mat-hint>
          <mat-error *ngIf="userForm.get('contraseña')?.hasError('required')">
            La contraseña es requerida
          </mat-error>
          <mat-error *ngIf="userForm.get('contraseña')?.hasError('minlength')">
            La contraseña debe tener al menos 6 caracteres
          </mat-error>
          <mat-error *ngIf="userForm.get('contraseña')?.hasError('pattern')">
            La contraseña debe contener mayúscula, minúscula y número
          </mat-error>
        </mat-form-field>
      </ng-container>
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Rol</mat-label>
        <mat-select formControlName="rol" required>
          <mat-option value="usuario">Usuario</mat-option>
          <mat-option value="propietario">Propietario</mat-option>
          <mat-option value="admin">Administrador</mat-option>
        </mat-select>
      </mat-form-field>
      <div class="modal-actions">
        <button mat-raised-button color="primary" type="submit">{{ data.editMode ? 'Actualizar' : 'Agregar' }}</button>
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [`
    .user-form-modal {
      display: flex;
      flex-direction: column;
      gap: 22px;
      min-width: 340px;
      max-width: 420px;
      margin: 0 auto;
      background: #f8f9fa;
      border-radius: 14px;
      padding: 28px 24px 18px 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    }
    .modal-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 18px;
    }
    h2[mat-dialog-title] {
      text-align: center;
      font-size: 1.35rem;
      font-weight: 600;
      margin-bottom: 10px;
      color: #1e3c72;
    }
    mat-form-field {
      width: 100%;
    }
    ::ng-deep .user-form-modal .mat-form-field-label {
      color: #222 !important;
    }
    ::ng-deep .user-form-modal .mat-input-element {
      color: #222 !important;
      background: #fff !important;
    }
    ::ng-deep .user-form-modal .mat-form-field-underline {
      background-color: #1e3c72 !important;
    }
    ::ng-deep .user-form-modal .mat-form-field-flex {
      background: #fff !important;
    }
    button[mat-raised-button] {
      min-width: 110px;
      font-weight: 500;
    }
    button[mat-button] {
      font-weight: 400;
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
      contraseña: ['', data.editMode ? [] : [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      ]],
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