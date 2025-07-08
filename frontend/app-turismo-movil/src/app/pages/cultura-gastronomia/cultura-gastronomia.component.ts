import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MenuInferiorComponent } from '../menu-inferior/menu-inferior.component';

@Component({
  selector: 'app-cultura-gastronomia',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuInferiorComponent],
  templateUrl: './cultura-gastronomia.component.html',
  styleUrl: './cultura-gastronomia.component.scss'
})
export class CulturaGastronomiaComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
} 