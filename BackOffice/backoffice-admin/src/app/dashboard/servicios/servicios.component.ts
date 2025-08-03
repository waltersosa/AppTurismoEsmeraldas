import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getBackendUrl } from '../../config/api.config';

interface Service {
  name: string;
  status: 'online' | 'offline' | 'error';
  uptime: number;
  memory: number;
  connections: number;
  port: number;
  url: string;
}

interface ServicesResponse {
  success: boolean;
  data: Service[];
}

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div class="services-container">
      <div class="header">
        <h2>Monitoreo de Servicios</h2>
        <div class="controls">
          <button mat-raised-button color="primary" (click)="startAllServices()" [disabled]="isLoading">
            <mat-icon>play_arrow</mat-icon>
            Iniciar Todos
          </button>
          <button mat-raised-button color="warn" (click)="stopAllServices()" [disabled]="isLoading">
            <mat-icon>stop</mat-icon>
            Detener Todos
          </button>
          <button mat-raised-button (click)="refreshServices()" [disabled]="isLoading">
            <mat-icon>refresh</mat-icon>
            Actualizar
          </button>
        </div>
      </div>

      <div class="status-overview">
        <mat-card>
          <mat-card-content>
            <div class="status-grid">
              <div class="status-item">
                <span class="status-label">Servicios Online:</span>
                <span class="status-value online">{{onlineServices}}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Servicios Offline:</span>
                <span class="status-value offline">{{offlineServices}}</span>
              </div>
              <div class="status-item">
                <span class="status-label">Estado General:</span>
                <span class="status-value" [class]="overallStatus">{{getOverallStatusText()}}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="services-table">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Servicios del Sistema</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="isLoading" class="loading">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Cargando servicios...</p>
            </div>

            <table mat-table [dataSource]="services" *ngIf="!isLoading">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef> Servicio </th>
                <td mat-cell *matCellDef="let service"> {{service.name}} </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef> Estado </th>
                <td mat-cell *matCellDef="let service">
                  <span class="status-indicator" [class]="'status-' + service.status">
                    <mat-icon>{{getStatusIcon(service.status)}}</mat-icon>
                    {{getStatusText(service.status)}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="port">
                <th mat-header-cell *matHeaderCellDef> Puerto </th>
                <td mat-cell *matCellDef="let service"> {{service.port}} </td>
              </ng-container>

              <ng-container matColumnDef="uptime">
                <th mat-header-cell *matHeaderCellDef> Uptime </th>
                <td mat-cell *matCellDef="let service"> {{formatUptime(service.uptime)}} </td>
              </ng-container>

              <ng-container matColumnDef="memory">
                <th mat-header-cell *matHeaderCellDef> Memoria </th>
                <td mat-cell *matCellDef="let service"> {{formatMemory(service.memory)}} </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef> Acciones </th>
                <td mat-cell *matCellDef="let service">
                  <button mat-icon-button (click)="startService(service)" 
                          *ngIf="service.status === 'offline'"
                          matTooltip="Iniciar servicio">
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                  <button mat-icon-button (click)="stopService(service)" 
                          *ngIf="service.status === 'online'"
                          matTooltip="Detener servicio">
                    <mat-icon>stop</mat-icon>
                  </button>
                  <button mat-icon-button (click)="restartService(service)" 
                          matTooltip="Reiniciar servicio">
                    <mat-icon>refresh</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .services-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .controls {
      display: flex;
      gap: 12px;
    }
    .status-overview {
      margin-bottom: 20px;
    }
    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-label {
      font-weight: 500;
    }
    .status-value {
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
    }
    .status-value.online {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    .status-value.offline {
      background-color: #ffebee;
      color: #c62828;
    }
    .status-value.healthy {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    .status-value.degraded {
      background-color: #fff3e0;
      color: #ef6c00;
    }
    .status-value.unhealthy {
      background-color: #ffebee;
      color: #c62828;
    }
    .services-table {
      margin-top: 20px;
    }
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      gap: 16px;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
    }
    .status-online {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    .status-offline {
      background-color: #ffebee;
      color: #c62828;
    }
    .status-error {
      background-color: #fff3e0;
      color: #ef6c00;
    }
  `]
})
export class ServiciosComponent implements OnInit {
  services: Service[] = [];
  displayedColumns: string[] = ['name', 'status', 'port', 'uptime', 'memory', 'actions'];
  isLoading = false;
  onlineServices = 0;
  offlineServices = 0;
  overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadServices();
    // Actualizar cada 30 segundos
    setInterval(() => {
      this.loadServices();
    }, 30000);
  }

  loadServices(): void {
    this.isLoading = true;
    this.http.get<ServicesResponse>(getBackendUrl('/service')).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.services = response.data || [];
          this.calculateStatus();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading services:', error);
        this.snackBar.open('Error al cargar servicios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  calculateStatus(): void {
    this.onlineServices = this.services.filter(s => s.status === 'online').length;
    this.offlineServices = this.services.filter(s => s.status === 'offline').length;
    
    if (this.offlineServices === 0) {
      this.overallStatus = 'healthy';
    } else if (this.offlineServices < this.services.length / 2) {
      this.overallStatus = 'degraded';
    } else {
      this.overallStatus = 'unhealthy';
    }
  }

  startService(service: Service): void {
    this.http.post(getBackendUrl(`/service/${service.name}/start`), {}).subscribe({
      next: () => {
        this.snackBar.open(`Servicio ${service.name} iniciado`, 'Cerrar', { duration: 3000 });
        this.loadServices();
      },
      error: (error) => {
        console.error('Error starting service:', error);
        this.snackBar.open(`Error al iniciar ${service.name}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  stopService(service: Service): void {
    this.http.post(getBackendUrl(`/service/${service.name}/stop`), {}).subscribe({
      next: () => {
        this.snackBar.open(`Servicio ${service.name} detenido`, 'Cerrar', { duration: 3000 });
        this.loadServices();
      },
      error: (error) => {
        console.error('Error stopping service:', error);
        this.snackBar.open(`Error al detener ${service.name}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  restartService(service: Service): void {
    this.http.post(getBackendUrl(`/service/${service.name}/restart`), {}).subscribe({
      next: () => {
        this.snackBar.open(`Servicio ${service.name} reiniciado`, 'Cerrar', { duration: 3000 });
        this.loadServices();
      },
      error: (error) => {
        console.error('Error restarting service:', error);
        this.snackBar.open(`Error al reiniciar ${service.name}`, 'Cerrar', { duration: 3000 });
      }
    });
  }

  startAllServices(): void {
    this.http.post(getBackendUrl('/service/startAll'), {}).subscribe({
      next: () => {
        this.snackBar.open('Todos los servicios iniciados', 'Cerrar', { duration: 3000 });
        this.loadServices();
      },
      error: (error) => {
        console.error('Error starting all services:', error);
        this.snackBar.open('Error al iniciar servicios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  stopAllServices(): void {
    this.http.post(getBackendUrl('/service/stopAll'), {}).subscribe({
      next: () => {
        this.snackBar.open('Todos los servicios detenidos', 'Cerrar', { duration: 3000 });
        this.loadServices();
      },
      error: (error) => {
        console.error('Error stopping all services:', error);
        this.snackBar.open('Error al detener servicios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  refreshServices(): void {
    this.loadServices();
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'online': return 'check_circle';
      case 'offline': return 'cancel';
      case 'error': return 'error';
      default: return 'help';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  }

  getOverallStatusText(): string {
    switch (this.overallStatus) {
      case 'healthy': return 'Saludable';
      case 'degraded': return 'Degradado';
      case 'unhealthy': return 'No Saludable';
      default: return 'Desconocido';
    }
  }

  formatUptime(uptime: number): string {
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  formatMemory(memory: number): string {
    return `${(memory / 1024 / 1024).toFixed(1)} MB`;
  }
} 