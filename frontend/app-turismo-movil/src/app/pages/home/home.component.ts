import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userName: string = '';
  showComingSoon = false;

  constructor(private router: Router) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          this.userName = user.nombre || user.email || '';
        } catch {
          this.userName = '';
        }
      }
    }
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
