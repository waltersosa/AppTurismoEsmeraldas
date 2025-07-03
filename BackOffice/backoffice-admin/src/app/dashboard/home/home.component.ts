import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';

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

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon users">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-info">
                <h3>1,247</h3>
                <p>Usuarios Registrados</p>
                <span class="stat-change positive">+12% este mes</span>
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
                <h3>45</h3>
                <p>Destinos Activos</p>
                <span class="stat-change positive">+3 nuevos</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon bookings">
                <mat-icon>book_online</mat-icon>
              </div>
              <div class="stat-info">
                <h3>892</h3>
                <p>Reservas Este Mes</p>
                <span class="stat-change positive">+8% vs mes anterior</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-icon revenue">
                <mat-icon>attach_money</mat-icon>
              </div>
              <div class="stat-info">
                <h3>$45,230</h3>
                <p>Ingresos Este Mes</p>
                <span class="stat-change positive">+15% vs mes anterior</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div class="actions-grid">
          <button mat-raised-button color="primary" class="action-button">
            <mat-icon>add</mat-icon>
            <span>Agregar Destino</span>
          </button>
          
          <button mat-raised-button color="accent" class="action-button">
            <mat-icon>person_add</mat-icon>
            <span>Crear Usuario</span>
          </button>
          
          <button mat-raised-button color="warn" class="action-button">
            <mat-icon>analytics</mat-icon>
            <span>Ver Reportes</span>
          </button>
          
          <button mat-raised-button class="action-button">
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
              <div class="activity-item">
                <div class="activity-icon">
                  <mat-icon>person_add</mat-icon>
                </div>
                <div class="activity-content">
                  <h4>Nuevo usuario registrado</h4>
                  <p>María González se registró en la plataforma</p>
                  <span class="activity-time">Hace 2 horas</span>
                </div>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="activity-item">
                <div class="activity-icon">
                  <mat-icon>book_online</mat-icon>
                </div>
                <div class="activity-content">
                  <h4>Nueva reserva realizada</h4>
                  <p>Reserva para "Playa de Atacames" - 3 días</p>
                  <span class="activity-time">Hace 4 horas</span>
                </div>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="activity-item">
                <div class="activity-icon">
                  <mat-icon>place</mat-icon>
                </div>
                <div class="activity-content">
                  <h4>Destino actualizado</h4>
                  <p>Información de "Manglares de Muisne" actualizada</p>
                  <span class="activity-time">Hace 6 horas</span>
                </div>
              </div>
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
export class HomeComponent {} 