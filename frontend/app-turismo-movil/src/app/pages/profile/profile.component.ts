import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router, private http: HttpClient) {
    try {
      this.getUserDetails()
      this.newName = this.userName;
    } catch {
      this.userName = '';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
    const token = localStorage.getItem('token');
    if (!token) {
      this.editError = 'No hay sesión activa.';
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    // Actualizar nombre
    this.http.put<any>(`https://geoapi.esmeraldas.gob.ec/new/actualizarUser?id=${this.userId}`,
      { nombre: this.newName }, { headers }).subscribe({

        next: (resp) => {
          if (resp.usuario) {
            localStorage.setItem('user', JSON.stringify(resp.usuario));
            this.userName = resp.usuario.nombre || resp.usuario.email || '';
          } else {
            // fallback por si la API no retorna el usuario actualizado
            const userStr = localStorage.getItem('user');
            let user = {};
            if (userStr) {
              try { user = JSON.parse(userStr); } catch { }
            }
            user = { ...user, nombre: this.newName };
            localStorage.setItem('user', JSON.stringify(user));
            this.userName = this.newName;
          }
          // Si hay nueva contraseña, hacer petición aparte
          if (this.newPassword) {
            this.http.put<any>('http://localhost:3001/auth/change-password', {
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
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró token para autenticación');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.http.get<any>('https://geoapi.esmeraldas.gob.ec/new/me', { headers }).subscribe({
      next: (resp) => {
        // Asumiendo que 'resp' tiene la estructura con 'nombre' o 'email'
        this.userName = resp.data.name || '';
      },
      error: (err) => {
        console.error('Error al obtener detalles de usuario', err);
        // Aquí puedes manejar algún mensaje de error si quieres
      }
    });
  }
}
