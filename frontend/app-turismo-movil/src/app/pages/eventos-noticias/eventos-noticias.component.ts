import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MenuInferiorComponent } from '../menu-inferior/menu-inferior.component';

@Component({
  selector: 'app-eventos-noticias',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuInferiorComponent],
  templateUrl: './eventos-noticias.component.html',
  styleUrl: './eventos-noticias.component.scss'
})
export class EventosNoticiasComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/home']);
  }
} 