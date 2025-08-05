import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MenuInferiorComponent } from '../menu-inferior/menu-inferior.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  constructor(private router: Router, private http: HttpClient) {
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

  ngOnInit(): void {
    this.getUserDetails()
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
        const nombreDeUsuario = localStorage.getItem('userName');
        this.userName = nombreDeUsuario ? nombreDeUsuario.replace(/^"(.*)"$/, '$1') : '';
 
      }
    });
  }

  goToNotificaciones() {
    this.router.navigate(['/notificaciones']);
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
