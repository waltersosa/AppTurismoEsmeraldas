import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MenuInferiorComponent } from '../menu-inferior/menu-inferior.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuInferiorComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  userName: string = '';
  showComingSoon = false;

  constructor(
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService
  ) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          this.getUserDetails();
        } catch {
          this.userName = ' ';
        }
      }
    }
  }

  getUserDetails() {
    this.authService.getUserInfo().subscribe({
      next: (user) => {
        if (user) {
          this.userName = user.nombre || user.name || '';
        } else {
          // Si no se puede obtener del servidor, usar localStorage como fallback
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            this.userName = currentUser.nombre || currentUser.name || '';
          } else {
            this.userName = 'Usuario';
          }
        }
      },
      error: (err) => {
        console.error('Error al obtener detalles de usuario', err);
        // Intentar obtener desde localStorage como fallback
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.userName = currentUser.nombre || currentUser.name || '';
        } else {
          this.userName = 'Usuario';
        }
      }
    });
  }


  goToEmergencias() {
    this.router.navigate(['/emergencias']);
  }

  goToEventosNoticias() {
    this.router.navigate(['/eventos-noticias']);
  }

  goToCulturaGastronomia() {
    this.router.navigate(['/cultura-gastronomia']);
  }

  showComingSoonMsg() {
    this.showComingSoon = true;
    setTimeout(() => {
      this.showComingSoon = false;
    }, 1800);
  }
}
