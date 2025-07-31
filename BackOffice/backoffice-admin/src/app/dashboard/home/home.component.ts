import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialogComponent } from '../usuarios/usuario-dialog.component';
import { Router } from '@angular/router';
import { PlaceDialogComponent } from '../place/place-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatsService, StatsOverview, SimpleHealth } from '../../services/stats.service';
import { getStatsServiceUrl, getPlacesServiceUrl } from '../../config/api.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="home-container">
      <div class="welcome-section">
        <h1>Bienvenido al Panel GAD</h1>
        <p>Gestiona la plataforma de turismo de Esmeraldas desde el Gobierno Autónomo Descentralizado</p>
      </div>

      <!-- Health Check Status -->
      <div class="health-status-section">
        <h2>Estado del Sistema</h2>
        <div class="health-grid">
          <mat-card class="health-card">
            <mat-card-content>
              <div class="health-content">
                <div class="health-icon" [ngClass]="healthStatus.status">
                  <mat-icon>{{ getHealthIcon(healthStatus.status) }}</mat-icon>
                </div>
                <div class="health-info">
                  <h3>{{ healthStatus.status.toUpperCase() }}</h3>
                  <p>{{ healthStatus.online }}/{{ healthStatus.total }} servicios online</p>
                  <mat-chip-set>
                    <mat-chip [color]="healthStatus.status === 'healthy' ? 'primary' : 'warn'" selected>
                      {{ healthStatus.status === 'healthy' ? 'Sistema Operativo' : 'Problemas Detectados' }}
                    </mat-chip>
                  </mat-chip-set>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Statistics -->
      <div *ngIf="loading" class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div style="text-align: center; padding: 20px;">
              <mat-spinner diameter="40"></mat-spinner>
              <p style="margin-top: 10px;">Cargando estadísticas...</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div *ngIf="error" class="stats-grid">
        <mat-card class="stat-card error">
          <mat-card-content>
            <div style="text-align: center; padding: 20px; color: #f44336;">
              <mat-icon style="font-size: 48px; margin-bottom: 10px;">error</mat-icon>
              <p>{{ error }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div *ngIf="!loading && !error" class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon users">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.usuarios }}</h3>
                <p>Usuarios Registrados</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon destinations">
                <mat-icon>place</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.lugares }}</h3>
                <p>Destinos Activos</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon bookings">
                <mat-icon>rate_review</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.resenas }}</h3>
                <p>Reseñas</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon revenue">
                <mat-icon>collections</mat-icon>
              </div>
              <div class="stat-info">
                <h3>{{ stats.imagenes }}</h3>
                <p>Imágenes</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <button mat-raised-button color="primary" class="action-button" (click)="openCrearLugarTuristico()">
            <mat-icon>add_location_alt</mat-icon>
            <span>Agregar Lugar Turístico</span>
          </button>
          
          <button mat-raised-button color="accent" class="action-button" (click)="openCrearUsuario()">
            <mat-icon>person_add</mat-icon>
            <span>Crear Usuario</span>
          </button>
          
          <button mat-raised-button color="warn" class="action-button" (click)="verResenas()">
            <mat-icon>rate_review</mat-icon>
            <span>Ver Reseñas</span>
          </button>
          
          <button mat-raised-button class="action-button" (click)="openConfiguracion()">
            <mat-icon>settings</mat-icon>
            <span>Configuración</span>
          </button>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Actividad Reciente</h2>
        <mat-card>
          <mat-card-content>
            <div class="activity-list">
              <div *ngFor="let act of actividades" class="activity-item">
                <div class="activity-icon">
                  <mat-icon>history</mat-icon>
                </div>
                <div class="activity-content">
                  <h4>{{ act.nombreUsuario }} {{ act.accion }}</h4>
                  <p *ngIf="act.recurso && act.recurso !== ''" class="activity-resource">{{ act.recurso }}</p>
                  <span class="activity-time">{{ act.fecha | date:'short' }}</span>
                </div>
              </div>
              <mat-divider *ngIf="!actividades.length"></mat-divider>
              <div *ngIf="!actividades.length" style="text-align:center; color:#999; padding:16px;">No hay actividades recientes</div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
    }

    .welcome-section h1 {
      color: #1e3c72;
      margin-bottom: 10px;
      font-size: 2.5rem;
      font-weight: 600;
    }

    .welcome-section p {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .health-status-section {
      margin-bottom: 30px;
    }

    .health-status-section h2 {
      color: #1e3c72;
      margin-bottom: 15px;
    }

    .health-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .health-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .health-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .health-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .health-icon.healthy {
      background: linear-gradient(135deg, #4caf50, #45a049);
    }

    .health-icon.degraded {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .health-icon.unhealthy {
      background: linear-gradient(135deg, #f44336, #d32f2f);
    }

    .health-info h3 {
      margin: 0 0 5px 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .health-info p {
      margin: 0 0 10px 0;
      color: #666;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.users {
      background: linear-gradient(135deg, #2196f3, #1976d2);
    }

    .stat-icon.destinations {
      background: linear-gradient(135deg, #4caf50, #388e3c);
    }

    .stat-icon.bookings {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .stat-icon.revenue {
      background: linear-gradient(135deg, #9c27b0, #7b1fa2);
    }

    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #333;
    }

    .stat-info p {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .quick-actions {
      margin-bottom: 30px;
    }

    .quick-actions h2 {
      color: #1e3c72;
      margin-bottom: 15px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .action-button {
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      height: auto;
      min-height: 80px;
    }

    .action-button mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .recent-activity h2 {
      color: #1e3c72;
      margin-bottom: 15px;
    }

    .activity-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      background: #f5f5f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }

    .activity-content h4 {
      margin: 0 0 5px 0;
      font-size: 1rem;
      color: #333;
    }

    .activity-content p {
      margin: 0 0 5px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .activity-resource {
      background: #f0f0f0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #555;
      display: inline-block;
      margin: 2px 0;
    }

    .activity-time {
      color: #999;
      font-size: 0.8rem;
    }

    .error {
      border-left: 4px solid #f44336;
    }
  `]
})
export class HomeComponent implements OnInit {
  stats: StatsOverview = { usuarios: 0, lugares: 0, resenas: 0, imagenes: 0 };
  healthStatus: SimpleHealth = { status: 'unhealthy', online: 0, total: 0, timestamp: '', services: [] };
  loading = true;
  error = '';
  actividades: any[] = [];

  constructor(
    private http: HttpClient, 
    private dialog: MatDialog, 
    private router: Router, 
    private snackBar: MatSnackBar,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = '';

    // Cargar health check y estadísticas en paralelo
    Promise.all([
      this.loadHealthStatus(),
      this.loadStats(),
      this.loadActivities()
    ]).finally(() => {
      this.loading = false;
    });
  }

  loadHealthStatus() {
    return new Promise<void>((resolve) => {
      this.statsService.getSimpleHealth().subscribe({
        next: (health) => {
          this.healthStatus = health;
          resolve();
        },
        error: (err) => {
          console.error('Error loading health status:', err);
          this.healthStatus = { status: 'unhealthy', online: 0, total: 0, timestamp: '', services: [] };
          resolve();
        }
      });
    });
  }

  loadStats() {
    return new Promise<void>((resolve) => {
      this.statsService.getStatsOverview().subscribe({
        next: (stats) => {
          this.stats = stats;
          resolve();
        },
        error: (err) => {
          console.error('Error loading stats:', err);
          this.error = 'Error al cargar estadísticas: ' + (err.error?.message || err.message);
          resolve();
        }
      });
    });
  }

  loadActivities() {
    return new Promise<void>((resolve) => {
      // Cargar actividades unificadas desde el backend unificado
      this.http.get<any>('http://localhost:3001/places/admin/actividades-unificadas').subscribe({
        next: (res) => {
          if (res.actividades) {
            this.actividades = res.actividades.slice(0, 10); // Solo las últimas 10
          } else {
            this.actividades = [];
          }
          resolve();
        },
        error: (err) => {
          console.error('Error loading unified activities:', err);
          this.actividades = [];
          resolve();
        }
      });
    });
  }

  getHealthIcon(status: string): string {
    switch (status) {
      case 'healthy': return 'check_circle';
      case 'degraded': return 'warning';
      case 'unhealthy': return 'error';
      default: return 'help';
    }
  }

  openCrearUsuario() {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Usuario creado correctamente', 'Cerrar', { duration: 2000 });
      }
    });
  }

  openCrearLugarTuristico() {
    const dialogRef = this.dialog.open(PlaceDialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Lugar turístico creado correctamente', 'Cerrar', { duration: 2000 });
        this.loadStats(); // Recargar estadísticas
      }
    });
  }

  verResenas() {
    this.router.navigate(['/dashboard/review']);
  }

  openConfiguracion() {
    this.snackBar.open('Configuración próximamente disponible', 'Cerrar', { duration: 2000 });
  }
} 