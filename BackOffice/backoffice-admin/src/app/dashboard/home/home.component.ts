import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioDialogComponent } from '../usuarios/usuario-dialog.component';
import { Router } from '@angular/router';
import { PlaceDialogComponent } from '../place/place-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule
  ],
  template: `
    <div class="home-container">
      <div class="welcome-section">
        <h1>Bienvenido al Panel GAD</h1>
        <p>Gestiona la plataforma de turismo de Esmeraldas desde el Gobierno Autónomo Descentralizado</p>
      </div>

      <div *ngIf="loading" class="stats-grid"><mat-card class="stat-card">Cargando estadísticas...</mat-card></div>
      <div *ngIf="error" class="stats-grid"><mat-card class="stat-card error">{{ error }}</mat-card></div>
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
                  <p *ngIf="act.recurso">{{ act.recurso }}</p>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-icon.destinations {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-icon.bookings {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-icon.revenue {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-info h3 {
      margin: 0 0 5px 0;
      font-size: 1.8rem;
      font-weight: 600;
      color: #333;
    }

    .stat-info p {
      margin: 0 0 5px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .stat-change {
      font-size: 0.8rem;
      font-weight: 500;
    }

    .stat-change.positive {
      color: #4caf50;
    }

    .stat-change.negative {
      color: #f44336;
    }

    .quick-actions {
      margin-bottom: 30px;
    }

    .quick-actions h2 {
      color: #1e3c72;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .action-button {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 1rem;
      border-radius: 8px;
    }

    .recent-activity h2 {
      color: #1e3c72;
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .activity-list {
      padding: 10px 0;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 15px;
      padding: 15px 0;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e3f2fd;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1976d2;
      flex-shrink: 0;
    }

    .activity-content h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 1rem;
    }

    .activity-content p {
      margin: 0 0 5px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .activity-time {
      color: #999;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
      
      .welcome-section h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  stats = { usuarios: 0, lugares: 0, resenas: 0, imagenes: 0 };
  loading = true;
  error = '';
  private statsUrl = 'http://localhost:3001/stats'; // Cambia esto si usas variable de entorno
  actividades: any[] = [];

  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getStats();
    this.getActividades();
  }

  getStats() {
    this.loading = true;
    this.error = '';
    this.http.get<any>(this.statsUrl).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.stats = res.data;
        } else {
          this.error = 'No se pudieron obtener las estadísticas';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al obtener estadísticas';
        this.loading = false;
      }
    });
  }

  getActividades() {
    this.http.get<any>('http://localhost:3001/auth/admin/actividades?limit=10').subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.actividades) {
          this.actividades = res.data.actividades;
        } else {
          this.actividades = [];
        }
      },
      error: (err) => {
        this.actividades = [];
      }
    });
  }

  openCrearUsuario() {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      data: { editMode: false },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('http://localhost:3001/auth/register', result).subscribe({
          next: () => alert('Usuario creado correctamente'),
          error: err => alert('Error al crear usuario: ' + (err.error?.message || err.message))
        });
      }
    });
  }

  openCrearLugarTuristico() {
    const dialogRef = this.dialog.open(PlaceDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('http://localhost:3001/places', result).subscribe({
          next: () => alert('Lugar turístico creado correctamente'),
          error: err => alert('Error al crear lugar turístico: ' + (err.error?.message || err.message))
        });
      }
    });
  }

  verResenas() {
    this.router.navigate(['/dashboard/resenas']);
  }

  openConfiguracion() {
    this.snackBar.open('Esta función estará disponible próximamente.', 'Cerrar', {
      duration: 3000
    });
  }
} 