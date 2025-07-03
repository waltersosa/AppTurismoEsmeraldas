import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, User } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDialogComponent, UsuarioDialogData } from './usuario-dialog.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="usuarios-card">
      <div class="usuarios-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p class="subtitle">Lista de usuarios disponibles</p>
        </div>
      </div>
      <div class="usuarios-table-wrapper">
        <table mat-table [dataSource]="usuarios" class="mat-elevation-z8 usuarios-table">
          <ng-container matColumnDef="nombre">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let user">{{ user.nombre }}</td>
          </ng-container>
          <ng-container matColumnDef="correo">
            <th mat-header-cell *matHeaderCellDef>Correo</th>
            <td mat-cell *matCellDef="let user">{{ user.correo }}</td>
          </ng-container>
          <ng-container matColumnDef="rol">
            <th mat-header-cell *matHeaderCellDef>Rol</th>
            <td mat-cell *matCellDef="let user">{{ user.rol }}</td>
          </ng-container>
          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button color="warn" matTooltip="Eliminar" (click)="deleteUser(user)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; let i = index; columns: displayedColumns;" [class.zebra]="i % 2 === 0"></tr>
        </table>
      </div>
    </mat-card>
  `,
  styles: [`
    .usuarios-card { max-width: 1100px; margin: 40px auto; padding: 32px 24px; }
    .usuarios-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .usuarios-header h1 { margin: 0; font-size: 2.2rem; font-weight: 700; }
    .subtitle { color: #888; margin-top: 4px; font-size: 1.1rem; }
    .usuarios-table-wrapper { overflow-x: auto; }
    .usuarios-table { width: 100%; min-width: 600px; border-radius: 12px; overflow: hidden; }
    th.mat-header-cell, td.mat-cell { text-align: left; padding: 12px 16px; }
    tr.zebra { background: #f7fafd; }
    .user-form-modal { display: flex; flex-direction: column; gap: 18px; min-width: 320px; max-width: 400px; margin: 0 auto; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 12px; }
    ::ng-deep .user-form-modal .mat-form-field-label, ::ng-deep .user-form-modal .mat-input-element, ::ng-deep .user-form-modal .mat-form-field {
      color: #111 !important;
    }
    @media (max-width: 700px) {
      .usuarios-card { padding: 12px 2px; }
      .usuarios-table { min-width: 320px; }
      .usuarios-header { flex-direction: column; gap: 12px; align-items: flex-start; }
    }
  `]
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  displayedColumns = ['nombre', 'correo', 'rol', 'acciones'];
  userForm: FormGroup;
  editMode = false;
  editingUserId: string | null = null;

  private apiUrl = 'http://localhost:3001/auth/users';
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  constructor(private authService: AuthService) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios() {
    this.http.get<any>(this.apiUrl).subscribe(res => {
      this.usuarios = res.data?.usuarios || res.usuarios || [];
    });
  }

  openUserDialog(user?: User) {}

  editUser(user: User) {}

  onSubmit() {}

  deleteUser(user: User) {
    if (confirm(`¿Seguro que deseas eliminar a ${user.nombre}?`)) {
      this.http.delete<any>(`${this.apiUrl}/${user._id}`).subscribe(() => {
        this.getUsuarios();
        this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', { duration: 2500 });
      });
    }
  }

  resetForm() {
    this.editMode = false;
    this.editingUserId = null;
    this.userForm.reset();
  }

  // TemplateRef para el modal
  userFormTemplate: any;
} 