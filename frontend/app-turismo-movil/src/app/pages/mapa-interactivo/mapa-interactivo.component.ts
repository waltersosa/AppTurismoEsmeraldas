import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MenuInferiorComponent } from '../menu-inferior/menu-inferior.component';

@Component({
  selector: 'app-mapa-interactivo',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuInferiorComponent],
  templateUrl: './mapa-interactivo.component.html',
  styleUrl: './mapa-interactivo.component.scss'
})
export class MapaInteractivoComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
} 