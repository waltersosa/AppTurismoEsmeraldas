import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reportar-incidencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportar-incidencia.component.html',
  styleUrl: './reportar-incidencia.component.scss'
})
export class ReportarIncidenciaComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/emergencias']);
  }
} 