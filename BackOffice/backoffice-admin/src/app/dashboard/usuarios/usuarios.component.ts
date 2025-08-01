import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
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
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule
  ],
  template: `
    <mat-card class="usuarios-card">
      <div class="usuarios-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p class="subtitle">Lista de usuarios disponibles</p>
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
            <td mat-cell *matCellDef="let user">{{ user.nombres }}</td>
          </ng-container>
          <ng-container matColumnDef="correo">
            <th mat-header-cell *matHeaderCellDef>Correo</th>
            <td mat-cell *matCellDef="let user">{{ user.correo }}</td>
          </ng-container>
        <ng-container matColumnDef="rol_user">
          <th mat-header-cell *matHeaderCellDef>Rol</th>
          <td mat-cell *matCellDef="let user">
            <span class="role-badge" [class]="'role-' + user.rol_user">{{ user.rol_user }}</span>
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
          <tr mat-row *matRowDef="let row; let i = index; columns: displayedColumns;" [class.zebra]="i % 2 === 0"></tr>
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
    .role-gad { background: #e8f5e8; color: #388e3c; }
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
  displayedColumns = ['nombre', 'correo', 'rol_user', 'estado', 'acciones'];
  userForm: FormGroup;
  editMode = false;
  editingUserId: string | null = null;
  searchTerm = '';

  //private apiUrl = 'http://localhost:3001/auth/users';
  private apiUrl = 'https://geoapi.esmeraldas.gob.ec/new/usuario';
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
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    // Paso 1: obtener todos los roles
    this.http.get<any>('https://geoapi.esmeraldas.gob.ec/new/rol_user', { headers }).subscribe({
      next: (rolesRes) => {
        const roles = rolesRes.data || [];

        // Mapeamos los roles en un diccionario para acceso rápido
        const rolesMap: Record<number, string> = {};
        roles.forEach((rol: any) => {
          rolesMap[rol._id] = rol.nombre;
        });

        // Paso 2: obtener los usuarios
        const url = this.searchTerm
          ? `${this.apiUrl}?search=${encodeURIComponent(this.searchTerm)}`
          : this.apiUrl;

        this.http.get<any>(url, { headers }).subscribe({
          next: (res) => {
            const usuariosData = res.data;

            this.usuarios = usuariosData.map((u: any) => {
              const rolNombre = rolesMap[u.rol_user] || 'Desconocido';

              return {
                ...u,
                nombres: u.nombres,
                rol: rolNombre,
                rol_user: rolNombre, // puedes mantenerlo así si tu template lo usa
                correo: u.correo || u.email,
                activo: u.estado === 'On'
              };
            });
          },
          error: (err) => {
            console.error('Error al obtener usuarios:', err);
            this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener roles:', err);
        this.snackBar.open('Error al cargar roles de usuario', 'Cerrar', { duration: 3000 });
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
          this.updateUser(user.id, result);
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
    this.http.post<any>(this.apiUrl, userData).subscribe({
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
    // Por ahora solo actualizamos el perfil, no implementamos edición completa
    this.snackBar.open('Funcionalidad de edición en desarrollo', 'Cerrar', { duration: 3000 });
  }

  disableUser(user: User) {
    if (confirm(`¿Seguro que deseas deshabilitar a ${user.nombre}?`)) {
      this.http.delete<any>(`${this.apiUrl}/${user.id}`).subscribe({
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
  }

  enableUser(user: User) {
    if (confirm(`¿Seguro que deseas habilitar a ${user.nombre}?`)) {
      this.http.patch<any>(`${this.apiUrl}/${user.id}/enable`, {}).subscribe({
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
  }

  deleteUserPermanently(user: User) {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente a ${user.nombre}? Esta acción no se puede deshacer.`)) {
      this.http.delete<any>(`${this.apiUrl}/${user.id}/permanent`).subscribe({
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
  }

  deleteUser(user: User) {
    // Mantener compatibilidad con el método anterior
    this.disableUser(user);
  }

  resetForm() {
    this.editMode = false;
    this.editingUserId = null;
    this.userForm.reset();
  }

  // TemplateRef para el modal
  userFormTemplate: any;
} 