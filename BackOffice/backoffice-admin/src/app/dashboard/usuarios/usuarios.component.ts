import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, User } from '../../auth/auth.service';
import { getAuthUrl } from '../../config/api.config';
import { UsuarioDialogComponent } from './usuario-dialog.component';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule
  ],
  template: `
    <mat-card class="usuarios-card">
      <div class="usuarios-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p class="subtitle">Lista de usuarios locales del sistema</p>
        </div>
        <button mat-raised-button color="primary" (click)="openUserDialog()" class="add-button">
          <mat-icon>add</mat-icon>
          Agregar Usuario
        </button>
      </div>

      <!-- Filtro de búsqueda -->
      <div class="search-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Escribe para filtrar...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="onSearchChange()">
          <button mat-icon-button matSuffix (click)="onSearchChange()">
            <mat-icon>search</mat-icon>
          </button>
        </mat-form-field>
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
            <td mat-cell *matCellDef="let user">
              <span class="role-badge" [class]="'role-' + user.rol">{{ user.rol }}</span>
            </td>
          </ng-container>
          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let user">
              <span class="status-badge" [class]="user.activo ? 'active' : 'inactive'">
                {{ user.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let user">
              <div class="action-buttons">
                <button mat-icon-button color="primary" matTooltip="Editar" (click)="editUser(user)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" matTooltip="Deshabilitar" (click)="disableUser(user)" *ngIf="user.activo">
                  <mat-icon>block</mat-icon>
                </button>
                <button mat-icon-button color="accent" matTooltip="Habilitar" (click)="enableUser(user)" *ngIf="!user.activo">
                  <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" matTooltip="Eliminar permanentemente" (click)="deleteUserPermanently(user)">
                  <mat-icon>delete_forever</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </mat-card>
  `,
  styles: [`
    .usuarios-card { max-width: 1200px; margin: 40px auto; padding: 32px 24px; }
    .usuarios-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .usuarios-header h1 { margin: 0; font-size: 2.2rem; font-weight: 700; }
    .subtitle { color: #888; margin-top: 4px; font-size: 1.1rem; }
    .add-button { display: flex; align-items: center; gap: 8px; }
    .search-section { margin-bottom: 20px; }
    .search-field { width: 100%; max-width: 400px; }
    .usuarios-table-wrapper { overflow-x: auto; }
    .usuarios-table { width: 100%; min-width: 800px; border-radius: 12px; overflow: hidden; }
    th.mat-header-cell, td.mat-cell { text-align: left; padding: 12px 16px; }
    tr.zebra { background: #f7fafd; }
    .action-buttons { display: flex; gap: 4px; }
    .role-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }
    .role-usuario { background: #e3f2fd; color: #1976d2; }
    .role-propietario { background: #f3e5f5; color: #7b1fa2; }
    .role-admin { background: #e8f5e8; color: #388e3c; }
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    .status-badge.active { background: #e8f5e8; color: #388e3c; }
    .status-badge.inactive { background: #ffebee; color: #d32f2f; }
    .user-form-modal { display: flex; flex-direction: column; gap: 18px; min-width: 320px; max-width: 400px; margin: 0 auto; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 12px; }
    ::ng-deep .user-form-modal .mat-form-field-label, ::ng-deep .user-form-modal .mat-input-element, ::ng-deep .user-form-modal .mat-form-field {
      color: #111 !important;
    }
    @media (max-width: 700px) {
      .usuarios-card { padding: 12px 2px; }
      .usuarios-table { min-width: 320px; }
      .usuarios-header { flex-direction: column; gap: 12px; align-items: flex-start; }
      .action-buttons { flex-direction: column; }
    }
  `]
})
export class UsuariosComponent implements OnInit {
  usuarios: User[] = [];
  displayedColumns = ['nombre', 'correo', 'rol', 'estado', 'acciones'];
  userForm: FormGroup;
  editMode = false;
  editingUserId: string | null = null;
  searchTerm = '';

  private apiUrl = getAuthUrl('/users');
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private confirmationService = inject(ConfirmationService);

  constructor(private authService: AuthService) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      rol: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('UsuariosComponent ngOnInit');
    console.log('Usuario actual:', this.authService.getCurrentUser());
    console.log('Está autenticado:', this.authService.isAuthenticated());
    console.log('Token:', this.authService.getToken());
    this.getUsuarios();
  }

  getUsuarios() {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    console.log('Obteniendo usuarios...');
    console.log('Token:', token);
    console.log('URL:', this.apiUrl);

    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        console.log('res.data:', res.data);
        console.log('res.data.usuarios:', res.data?.usuarios);
        
        // El backend devuelve { success: true, data: { usuarios: [...] } }
        if (res && res.data && res.data.usuarios && Array.isArray(res.data.usuarios)) {
          console.log('Usando res.data.usuarios:', res.data.usuarios);
          this.usuarios = res.data.usuarios;
        } else if (res && res.usuarios && Array.isArray(res.usuarios)) {
          console.log('Usando res.usuarios:', res.usuarios);
          this.usuarios = res.usuarios;
        } else if (res && res.data && Array.isArray(res.data)) {
          console.log('Usando res.data:', res.data);
          this.usuarios = res.data;
        } else if (Array.isArray(res)) {
          console.log('Usando res directo:', res);
          this.usuarios = res;
        } else {
          console.log('No se encontró estructura válida, usando array vacío');
          console.log('Estructura completa de res:', JSON.stringify(res, null, 2));
          this.usuarios = [];
        }
        
        console.log('Usuarios finales:', this.usuarios);
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.usuarios = []; // Inicializar como array vacío en caso de error
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSearchChange() {
    this.getUsuarios();
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '400px',
      data: {
        user: user,
        editMode: !!user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.updateUser(user._id!, result);
        } else {
          this.createUser(result);
        }
      }
    });
  }

  editUser(user: User) {
    this.openUserDialog(user);
  }

  createUser(userData: any) {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post<any>(getAuthUrl('/users'), userData, { headers }).subscribe({
      next: () => {
        this.getUsuarios();
        this.snackBar.open('Usuario creado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        const message = error.error?.message || 'Error al crear usuario';
        this.snackBar.open(message, 'Cerrar', { duration: 3000 });
      }
    });
  }

  updateUser(userId: string, userData: any) {
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.put<any>(`${getAuthUrl('/users')}/${userId}`, userData, { headers }).subscribe({
      next: () => {
        this.getUsuarios();
        this.snackBar.open('Usuario actualizado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.snackBar.open('Error al actualizar usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

  disableUser(user: User) {
    this.confirmationService.confirmDisableUser(user.nombre).subscribe(confirmed => {
      if (confirmed) {
        const token = this.authService.getToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        this.http.patch<any>(`${getAuthUrl('/users')}/${user._id}/disable`, {}, { headers }).subscribe({
          next: () => {
            this.getUsuarios();
            this.snackBar.open('Usuario deshabilitado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al deshabilitar usuario:', error);
            this.snackBar.open('Error al deshabilitar usuario', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  enableUser(user: User) {
    this.confirmationService.confirmEnableUser(user.nombre).subscribe(confirmed => {
      if (confirmed) {
        const token = this.authService.getToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        this.http.patch<any>(`${getAuthUrl('/users')}/${user._id}/enable`, {}, { headers }).subscribe({
          next: () => {
            this.getUsuarios();
            this.snackBar.open('Usuario habilitado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al habilitar usuario:', error);
            this.snackBar.open('Error al habilitar usuario', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteUserPermanently(user: User) {
    this.confirmationService.confirmDeleteUser(user.nombre).subscribe(confirmed => {
      if (confirmed) {
        const token = this.authService.getToken();
        const headers = { 'Authorization': `Bearer ${token}` };

        this.http.delete<any>(`${getAuthUrl('/users')}/${user._id}`, { headers }).subscribe({
          next: () => {
            this.getUsuarios();
            this.snackBar.open('Usuario eliminado permanentemente', 'Cerrar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            this.snackBar.open('Error al eliminar usuario', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteUser(user: User) {
    this.disableUser(user);
  }

  resetForm() {
    this.editMode = false;
    this.editingUserId = null;
    this.userForm.reset();
  }

  userFormTemplate: any;
}