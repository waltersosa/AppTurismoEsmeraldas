import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-menu-inferior',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-inferior.component.html',
  styleUrls: ['./menu-inferior.component.scss']
})
export class MenuInferiorComponent {
  constructor(public router: Router) {}
} 