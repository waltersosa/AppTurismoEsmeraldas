import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-portada',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.scss']
})
export class PortadaComponent {
  constructor(private router: Router) {}
  irAlLogin() {
    this.router.navigate(['/login']);
  }
} 