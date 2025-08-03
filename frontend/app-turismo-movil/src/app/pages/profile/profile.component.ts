import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  userName: string = '';
  editing: boolean = false;
  newName: string = '';
  newEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  editError: string = '';
  showComingSoon: boolean = false;
  currentPassword: string = '';
  userId = localStorage.getItem('userId');

  constructor(
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService
  ) {
    try {
      this.getUserDetails();
      this.newName = this.userName;
    } catch {
      this.userName = '';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goBack() {
    if (this.editing) {
      this.editing = false;
      this.editError = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } else {
      this.router.navigate(['/home']);
    }
  }

  startEdit() {
    this.editing = true;
    this.editError = '';
    this.newName = this.userName;
    this.newPassword = '';
    this.confirmPassword = '';
  }

  saveEdit() {
    if (!this.newName.trim()) {
      this.editError = 'El nombre no puede estar vacío.';
      return;
    }
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.editError = 'Las contraseñas no coinciden.';
      return;
    }
    
    const token = this.authService.getToken();
    if (!token) {
      this.editError = 'No hay sesión activa.';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Actualizar perfil en BD local
    this.http.put<any>(environment.auth.local.profile, {
      nombre: this.newName
    }, { headers }).subscribe({
      next: (resp) => {
        console.log('✅ Perfil actualizado:', resp);
        
        // Actualizar datos en localStorage
        const user = this.authService.getUser();
        if (user) {
          user.nombre = this.newName;
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        this.userName = this.newName;
        
        // Si hay nueva contraseña, hacer petición aparte
        if (this.newPassword) {
          this.http.put<any>(environment.auth.local.changePassword, {
            contraseñaActual: this.currentPassword,
            nuevaContraseña: this.newPassword
          }, { headers }).subscribe({
            next: () => {
              this.editing = false;
              this.editError = '';
              this.newPassword = '';
              this.confirmPassword = '';
              this.currentPassword = '';
            },
            error: (err) => {
              this.editError = err.error?.error || 'Error al cambiar la contraseña';
            }
          });
        } else {
          this.editing = false;
          this.editError = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.currentPassword = '';
        }
      },
      error: (err) => {
        console.error('❌ Error al actualizar perfil:', err);
        this.editError = err.error?.error || 'Error al actualizar perfil';
      }
    });
  }

  showSoon() {
    this.showComingSoon = true;
    setTimeout(() => {
      this.showComingSoon = false;
    }, 1800);
  }

  getUserDetails() {
    console.log('👤 Obteniendo detalles del usuario desde BD local...');
    
    this.authService.obtenerPerfil().subscribe({
      next: (resp) => {
        console.log('✅ Perfil obtenido:', resp);
        if (resp.data?.usuario) {
          this.userName = resp.data.usuario.nombre || resp.data.usuario.correo || '';
          this.userId = resp.data.usuario.id;
        }
      },
      error: (err) => {
        console.error('❌ Error al obtener perfil:', err);
        // Fallback: intentar obtener datos del localStorage
        const user = this.authService.getUser();
        if (user) {
          this.userName = user.nombre || user.correo || '';
        }
      }
    });
  }
}
