import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { getBackendUrl } from '../../config/api.config';

interface DashboardStats {
  totalUsers: number;
  totalPlaces: number;
  totalReviews: number;
  totalImages: number;
  recentActivity: any[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  template: `
    <div class="home-container">
      <div class="welcome-section">
        <h1>Bienvenido al Panel de Administración</h1>
        <p>Gobierno Autónomo Descentralizado de Esmeraldas</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon users">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{stats.totalUsers}}</div>
                <div class="stat-label">Usuarios Registrados</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon places">
                <mat-icon>location_on</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{stats.totalPlaces}}</div>
                <div class="stat-label">Lugares Turísticos</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon reviews">
                <mat-icon>rate_review</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{stats.totalReviews}}</div>
                <div class="stat-label">Reseñas</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon images">
                <mat-icon>photo_library</mat-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{stats.totalImages}}</div>
                <div class="stat-label">Imágenes</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="recent-activity">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Actividad Reciente</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="isLoading" class="loading-container">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando actividad reciente...</p>
            </div>
            
            <div *ngIf="!isLoading && recentActivity.length > 0" class="activity-list">
              <div *ngFor="let activity of recentActivity" class="activity-item">
                <div class="activity-icon">
                  <mat-icon>{{getActivityIcon(activity.type)}}</mat-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-text">{{activity.description}}</div>
                  <div class="activity-time">{{formatDate(activity.timestamp)}}</div>
                  <div class="activity-user" *ngIf="activity.userId?.nombre">
                    Por: {{activity.userId.nombre}}
                  </div>
                </div>
              </div>
            </div>
            
            <div *ngIf="!isLoading && recentActivity.length === 0" class="no-activity">
              <mat-icon>info</mat-icon>
              <p>No hay actividad reciente</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #1976d2, #42a5f5);
      color: white;
      border-radius: 8px;
    }

    .welcome-section h1 {
      margin: 0 0 10px 0;
      font-size: 2.5em;
      font-weight: 300;
    }

    .welcome-section p {
      margin: 0;
      font-size: 1.2em;
      opacity: 0.9;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      transition: transform 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 15px;
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
      background: linear-gradient(135deg, #4caf50, #66bb6a);
    }

    .stat-icon.places {
      background: linear-gradient(135deg, #ff9800, #ffb74d);
    }

    .stat-icon.reviews {
      background: linear-gradient(135deg, #9c27b0, #ba68c8);
    }

    .stat-icon.images {
      background: linear-gradient(135deg, #f44336, #ef5350);
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-info {
      flex: 1;
    }

    .stat-number {
      font-size: 2em;
      font-weight: bold;
      color: #333;
      line-height: 1;
    }

    .stat-label {
      color: #666;
      font-size: 0.9em;
      margin-top: 5px;
    }

    .recent-activity {
      margin-top: 30px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      color: #666;
    }

    .activity-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #eee;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      margin-right: 15px;
    }

    .activity-icon mat-icon {
      color: #1976d2;
    }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      font-weight: 500;
      color: #333;
      margin-bottom: 5px;
    }

    .activity-time {
      font-size: 0.85em;
      color: #666;
    }

    .activity-user {
      font-size: 0.8em;
      color: #555;
      margin-top: 5px;
    }

    .no-activity {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-activity mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .welcome-section h1 {
        font-size: 2em;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  stats: DashboardStats = {
    totalUsers: 0,
    totalPlaces: 0,
    totalReviews: 0,
    totalImages: 0,
    recentActivity: []
  };
  recentActivity: any[] = [];
  isLoading = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Cargar métricas individuales
    this.loadIndividualStats();
    
    // Cargar actividad reciente
    this.http.get<{success: boolean, data: any[]}>(getBackendUrl('/activities/recent')).subscribe({
      next: (response) => {
        if (response.success) {
          this.recentActivity = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading recent activity:', error);
      }
    });

    this.isLoading = false;
  }

  loadIndividualStats(): void {
    // Cargar conteo de usuarios
    this.http.get<{count: number}>(getBackendUrl('/auth/users/count')).subscribe({
      next: (response) => {
        this.stats.totalUsers = response.count;
      },
      error: (error) => {
        console.error('Error loading users count:', error);
      }
    });

    // Cargar conteo de lugares
    this.http.get<{count: number}>(getBackendUrl('/places/count')).subscribe({
      next: (response) => {
        this.stats.totalPlaces = response.count;
      },
      error: (error) => {
        console.error('Error loading places count:', error);
      }
    });

    // Cargar conteo de reseñas
    this.http.get<{count: number}>(getBackendUrl('/reviews/count')).subscribe({
      next: (response) => {
        this.stats.totalReviews = response.count;
      },
      error: (error) => {
        console.error('Error loading reviews count:', error);
      }
    });

    // Cargar conteo de imágenes
    this.http.get<{count: number}>(getBackendUrl('/media/count')).subscribe({
      next: (response) => {
        this.stats.totalImages = response.count;
      },
      error: (error) => {
        console.error('Error loading media count:', error);
      }
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'user': return 'person_add';
      case 'place': return 'location_on';
      case 'review': return 'rate_review';
      case 'image': return 'photo_library';
      default: return 'info';
    }
  }

  formatDate(timestamp: string): string {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 