import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emergencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emergencias.component.html',
  styleUrl: './emergencias.component.scss'
})
export class EmergenciasComponent {
  constructor(private router: Router) {}

  showComingSoon = false;
  otrosNumerosExpandido = false;

  goBack() {
    this.router.navigate(['/home']);
  }

  showSoon() {
    this.showComingSoon = true;
    setTimeout(() => {
      this.showComingSoon = false;
    }, 1800);
  }

  toggleOtrosNumeros() {
    this.otrosNumerosExpandido = !this.otrosNumerosExpandido;
  }

  irAReportarIncidencia() {
    this.router.navigate(['/reportar-incidencia']);
  }
} 