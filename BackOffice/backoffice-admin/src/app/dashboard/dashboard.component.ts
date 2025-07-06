import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, User } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="dashboard-container">
      <!-- Sidebar -->
      <mat-sidenav #sidenav mode="side" opened class="dashboard-sidenav">
        <div class="sidenav-header">
          <h2>Esmeraldas Turismo</h2>
          <p>Panel GAD</p>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          
          <a mat-list-item routerLink="/dashboard/usuarios" routerLinkActive="active" class="nav-item">
            <mat-icon>people</mat-icon>
            <span>Usuarios</span>
          </a>
          
          <a mat-list-item routerLink="/dashboard/place" routerLinkActive="active" class="nav-item">
            <mat-icon>add_location_alt</mat-icon>
            <span>Lugares Turísticos</span>
          </a>
          
          <a mat-list-item routerLink="/dashboard/review" routerLinkActive="active" class="nav-item">
            <mat-icon>rate_review</mat-icon>
            <span>Reseñas</span>
          </a>
          
          <a mat-list-item routerLink="/dashboard/servicios" routerLinkActive="active" class="nav-item">
            <mat-icon>dns</mat-icon>
            <span>Servicios</span>
          </a>
          
          <a mat-list-item routerLink="/dashboard/reportes" routerLinkActive="active" class="nav-item" (click)="mostrarMensajeProximamente()">
            <mat-icon>analytics</mat-icon>
            <span>Reportes</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content class="dashboard-content">
        <!-- Top Toolbar -->
        <mat-toolbar color="primary" class="dashboard-toolbar">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          
          <span class="toolbar-spacer"></span>
          
          <div class="user-menu">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
              <mat-icon>account_circle</mat-icon>
              <span>{{ currentUser?.nombre }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item (click)="mostrarMensajeProximamente()">
                <mat-icon>person</mat-icon>
                <span>Mi Perfil</span>
              </button>
              <button mat-menu-item (click)="mostrarMensajeProximamente()">
                <mat-icon>settings</mat-icon>
                <span>Configuración</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Cerrar Sesión</span>
              </button>
            </mat-menu>
          </div>
        </mat-toolbar>

        <!-- Page Content -->
        <div class="dashboard-page">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
    }

    .dashboard-sidenav {
      width: 280px;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
    }

    .sidenav-header {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidenav-header h2 {
      margin: 0 0 5px 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .sidenav-header p {
      margin: 0;
      opacity: 0.8;
      font-size: 0.9rem;
    }

    .nav-item {
      color: white !important;
      margin: 5px 10px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-item:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

    .nav-item.active {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    .nav-item mat-icon {
      margin-right: 12px;
    }

    .dashboard-content {
      background-color: #f5f5f5;
    }

    .dashboard-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .user-menu {
      display: flex;
      align-items: center;
    }

    .user-button {
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dashboard-page {
      padding: 20px;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  mostrarMensajeProximamente() {
    this.snackBar.open('Esta función estará disponible próximamente.', 'Cerrar', {
      duration: 3000
    });
  }
} 