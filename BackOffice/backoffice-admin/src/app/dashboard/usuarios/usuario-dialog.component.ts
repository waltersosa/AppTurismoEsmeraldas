import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

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
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.editMode ? 'Editar Usuario' : 'Agregar Usuario' }}</h2>
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form-modal">
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" required />
        <mat-error *ngIf="userForm.get('nombre')?.hasError('required')">
          El nombre es requerido
        </mat-error>
      </mat-form-field>
      
             <mat-form-field appearance="outline" color="primary">
         <mat-label>Correo</mat-label>
         <input matInput formControlName="correo" required type="email" (input)="onEmailChange()" />
         <mat-error *ngIf="userForm.get('correo')?.hasError('required')">
           El correo es requerido
         </mat-error>
         <mat-error *ngIf="userForm.get('correo')?.hasError('email')">
           Ingrese un correo válido
         </mat-error>
         <mat-error *ngIf="userForm.get('correo')?.hasError('emailTaken')">
           Este correo ya está registrado
         </mat-error>
         <mat-hint *ngIf="emailChecking" class="email-checking">
           Verificando disponibilidad...
         </mat-hint>
         <mat-hint *ngIf="!emailChecking && userForm.get('correo')?.valid && !userForm.get('correo')?.hasError('emailTaken')" class="email-available">
           ✓ Correo disponible
         </mat-hint>
         <mat-hint *ngIf="!emailChecking && userForm.get('correo')?.hasError('emailTaken')" class="email-taken">
           ✗ Correo no disponible
         </mat-hint>
       </mat-form-field>
      
      <ng-container *ngIf="!data.editMode">
        <mat-form-field appearance="outline" color="primary">
          <mat-label>Contraseña</mat-label>
          <input matInput formControlName="contraseña" required type="password" />
          <mat-error *ngIf="userForm.get('contraseña')?.hasError('required')">
            La contraseña es requerida
          </mat-error>
          <mat-error *ngIf="userForm.get('contraseña')?.hasError('minlength')">
            La contraseña debe tener al menos 6 caracteres
          </mat-error>
        </mat-form-field>
      </ng-container>
      
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Rol</mat-label>
        <mat-select formControlName="rol" required>
          <mat-option value="usuario">Usuario</mat-option>
          <mat-option value="propietario">Propietario</mat-option>
          <mat-option value="gad">GAD</mat-option>
        </mat-select>
        <mat-error *ngIf="userForm.get('rol')?.hasError('required')">
          El rol es requerido
        </mat-error>
      </mat-form-field>
      
      <div class="modal-actions">
        <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">
          {{ data.editMode ? 'Actualizar' : 'Agregar' }}
        </button>
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
    
    /* Estilos para errores de validación */
    ::ng-deep .mat-form-field.mat-form-field-invalid .mat-form-field-label {
      color: #f44336 !important;
    }
    
    ::ng-deep .mat-form-field.mat-form-field-invalid .mat-form-field-underline {
      background-color: #f44336 !important;
    }
    
    ::ng-deep .mat-error {
      color: #f44336 !important;
      font-size: 0.75rem !important;
    }
    
         /* Botón deshabilitado */
     button[mat-raised-button][disabled] {
       background-color: #ccc !important;
       color: #666 !important;
     }
     
     /* Estilos para indicadores de correo */
     .email-checking {
       color: #ff9800 !important;
       font-style: italic;
     }
     
     .email-available {
       color: #4caf50 !important;
       font-weight: 500;
     }
     
     .email-taken {
       color: #f44336 !important;
       font-weight: 500;
     }
  `]
})
export class UsuarioDialogComponent {
  userForm: FormGroup;
  emailChecking = false;
  private emailCheckSubject = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDialogData,
    private http: HttpClient
  ) {
    this.userForm = this.fb.group({
      nombre: [data.user?.nombre || '', Validators.required],
      correo: [data.user?.correo || '', [Validators.required, Validators.email]],
      contraseña: ['', data.editMode ? [] : [Validators.required, Validators.minLength(6)]],
      rol: [data.user?.rol || '', Validators.required]
    });

    // Configurar validación en tiempo real del correo
    this.setupEmailValidation();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    // Solo enviar contraseña si no está en modo edición o si se proporcionó
    const formData = { ...this.userForm.value };
    if (this.data.editMode && !formData.contraseña) {
      delete formData.contraseña;
    }
    
    this.dialogRef.close(formData);
  }

  private setupEmailValidation() {
    // Solo configurar validación en tiempo real si no está en modo edición
    if (!this.data.editMode) {
      this.emailCheckSubject.pipe(
        debounceTime(500), // Esperar 500ms después de que el usuario deje de escribir
        distinctUntilChanged(), // Solo verificar si el correo cambió
        switchMap(email => this.checkEmailAvailability(email))
      ).subscribe();
    }
  }

  private checkEmailAvailability(email: string) {
    this.emailChecking = true;
    
    return this.http.get<any>(`http://localhost:3001/auth/check-email/${encodeURIComponent(email)}`).pipe(
      switchMap(response => {
        this.emailChecking = false;
        
        if (response.data?.disponible === false) {
          // Correo no disponible
          this.userForm.get('correo')?.setErrors({ emailTaken: true });
        } else {
          // Correo disponible, limpiar errores
          const currentErrors = this.userForm.get('correo')?.errors;
          if (currentErrors) {
            delete currentErrors.emailTaken;
            if (Object.keys(currentErrors).length === 0) {
              this.userForm.get('correo')?.setErrors(null);
            } else {
              this.userForm.get('correo')?.setErrors(currentErrors);
            }
          }
        }
        
        return [];
      }),
      catchError(error => {
        this.emailChecking = false;
        console.error('Error verificando correo:', error);
        return of([]);
      })
    );
  }

  onEmailChange() {
    const email = this.userForm.get('correo')?.value;
    if (email && this.userForm.get('correo')?.valid) {
      this.emailCheckSubject.next(email);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }
} 