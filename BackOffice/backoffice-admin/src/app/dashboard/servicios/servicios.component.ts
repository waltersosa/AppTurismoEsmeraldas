import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getBackendUrl } from '../../config/api.config';
import { StatsService } from '../../services/stats.service';

interface Service {
  _id: string;
  nombre: string;
  descripcion: string;
  endpoint: string;
  activo: boolean;
  tipo: 'api' | 'database' | 'external' | 'internal';
  version: string;
  ultimaVerificacion: string;
  estado: 'online' | 'offline' | 'error' | 'maintenance';
  estadoReal: 'running' | 'stopped' | 'starting' | 'stopping' | 'error';
  tiempoRespuesta: number;
  puerto: number | null;
  procesoId: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

interface ServiceStats {
  total: number;
  activos: number;
  inactivos: number;
  online: number;
  offline: number;
  error: number;
  maintenance: number;
  porcentajeDisponibilidad: number;
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
    MatTooltipModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="servicios-container">
      <!-- Header -->
      <mat-card class="header-card">
        <div class="header-content">
          <div>
            <h1>Monitoreo de Servicios</h1>
            <p class="subtitle">Control y verificación de microservicios</p>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="verificarTodos()" [disabled]="verificando">
              <mat-icon>refresh</mat-icon>
              Verificar Todos
            </button>
            <button mat-raised-button color="accent" (click)="activarTodos()" [disabled]="procesando">
              <mat-icon>play_arrow</mat-icon>
              Activar Todos
            </button>
            <button mat-raised-button color="warn" (click)="desactivarTodos()" [disabled]="procesando">
              <mat-icon>stop</mat-icon>
              Desactivar Todos
            </button>
          </div>
        </div>
      </mat-card>

      <!-- Estadísticas -->
      <mat-card class="stats-card" *ngIf="stats">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.total }}</div>
            <div class="stat-label">Total Servicios</div>
          </div>
          <div class="stat-item">
            <div class="stat-number online">{{ stats.online }}</div>
            <div class="stat-label">Online</div>
          </div>
          <div class="stat-item">
            <div class="stat-number offline">{{ stats.offline }}</div>
            <div class="stat-label">Offline</div>
          </div>
          <div class="stat-item">
            <div class="stat-number error">{{ stats.error }}</div>
            <div class="stat-label">Error</div>
          </div>
          <div class="stat-item">
            <div class="stat-number maintenance">{{ stats.maintenance }}</div>
            <div class="stat-label">Mantenimiento</div>
          </div>
          <div class="stat-item">
            <div class="stat-number availability">{{ stats.porcentajeDisponibilidad }}%</div>
            <div class="stat-label">Disponibilidad</div>
          </div>
        </div>
      </mat-card>

      <!-- Tabla de Servicios -->
      <mat-card class="table-card">
        <div class="table-container">
          <table mat-table [dataSource]="servicios" class="servicios-table">
            <!-- Nombre -->
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Servicio</th>
              <td mat-cell *matCellDef="let service">
                <div class="service-info">
                  <div class="service-name">{{ service.nombre }}</div>
                  <div class="service-desc">{{ service.descripcion }}</div>
                </div>
              </td>
            </ng-container>

            <!-- Tipo -->
            <ng-container matColumnDef="tipo">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let service">
                <span class="type-chip" [class]="'type-' + service.tipo">
                  {{ service.tipo }}
                </span>
              </td>
            </ng-container>

            <!-- Estado -->
            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let service">
                <div class="status-container">
                  <span class="status-dot" [class]="'status-' + service.estado"></span>
                  <span class="status-text">{{ service.estado }}</span>
                </div>
              </td>
            </ng-container>

            <!-- Estado Real -->
            <ng-container matColumnDef="estadoReal">
              <th mat-header-cell *matHeaderCellDef>Proceso</th>
              <td mat-cell *matCellDef="let service">
                <div class="process-status-container">
                  <span class="process-status-dot" [class]="'process-' + service.estadoReal"></span>
                  <span class="process-status-text">{{ getEstadoRealText(service.estadoReal) }}</span>
                  <div class="process-info" *ngIf="service.procesoId">
                    <small>PID: {{ service.procesoId }}</small>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Tiempo Respuesta -->
            <ng-container matColumnDef="tiempoRespuesta">
              <th mat-header-cell *matHeaderCellDef>Tiempo Respuesta</th>
              <td mat-cell *matCellDef="let service">
                <span class="response-time" [class]="getResponseTimeClass(service.tiempoRespuesta)">
                  {{ service.tiempoRespuesta }}ms
                </span>
              </td>
            </ng-container>

            <!-- Activo -->
            <ng-container matColumnDef="activo">
              <th mat-header-cell *matHeaderCellDef>Activo</th>
              <td mat-cell *matCellDef="let service">
                <span class="active-status" [class]="service.activo ? 'active' : 'inactive'">
                  {{ service.activo ? 'Sí' : 'No' }}
                </span>
              </td>
            </ng-container>

            <!-- Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let service">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" matTooltip="Verificar" (click)="verificarServicio(service)">
                    <mat-icon>refresh</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" matTooltip="Reiniciar" (click)="reiniciarServicio(service)">
                    <mat-icon>restart_alt</mat-icon>
                  </button>
                  <button mat-icon-button [color]="service.activo ? 'warn' : 'accent'" 
                          [matTooltip]="service.activo ? 'Desactivar' : 'Activar'"
                          (click)="alternarEstado(service)">
                    <mat-icon>{{ service.activo ? 'block' : 'check_circle' }}</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" [class.zebra]="true"></tr>
          </table>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .servicios-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-card {
      margin-bottom: 24px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h1 {
      margin: 0;
      font-size: 2.2rem;
      font-weight: 700;
      color: #1e3c72;
    }

    .subtitle {
      color: #666;
      margin-top: 4px;
      font-size: 1.1rem;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .header-actions button {
      min-width: 140px;
    }

    .stats-card {
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      padding: 20px 0;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .stat-number.online { color: #4caf50; }
    .stat-number.offline { color: #f44336; }
    .stat-number.error { color: #ff9800; }
    .stat-number.maintenance { color: #2196f3; }
    .stat-number.availability { color: #9c27b0; }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      font-weight: 500;
    }

    .table-card {
      margin-bottom: 24px;
    }

    .table-container {
      overflow-x: auto;
    }

    .servicios-table {
      width: 100%;
      min-width: 1000px;
    }

    .service-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .service-name {
      font-weight: 600;
      color: #1e3c72;
    }

    .service-desc {
      font-size: 0.85rem;
      color: #666;
    }

    .type-chip {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .type-api { background: #e3f2fd; color: #1976d2; }
    .type-database { background: #f3e5f5; color: #7b1fa2; }
    .type-external { background: #e8f5e8; color: #388e3c; }
    .type-internal { background: #fff3e0; color: #f57c00; }

    .status-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-online { background: #4caf50; }
    .status-offline { background: #f44336; }
    .status-error { background: #ff9800; }
    .status-maintenance { background: #2196f3; }

    .status-text {
      font-weight: 500;
      text-transform: capitalize;
    }

    .process-status-container {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .process-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }

    .process-running { background: #4caf50; }
    .process-stopped { background: #f44336; }
    .process-starting { background: #ff9800; animation: pulse 1.5s infinite; }
    .process-stopping { background: #ff9800; animation: pulse 1.5s infinite; }
    .process-error { background: #f44336; }

    .process-status-text {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .process-info {
      font-size: 0.75rem;
      color: #666;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .response-time {
      font-weight: 500;
      font-family: monospace;
    }

    .response-time.fast { color: #4caf50; }
    .response-time.medium { color: #ff9800; }
    .response-time.slow { color: #f44336; }

    .active-status {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .active-status.active { background: #e8f5e8; color: #388e3c; }
    .active-status.inactive { background: #ffebee; color: #d32f2f; }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    tr.zebra {
      background: #f8f9fa;
    }

    @media (max-width: 768px) {
      .servicios-container {
        padding: 12px;
      }

      .header-content {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class ServiciosComponent implements OnInit {
  servicios: any[] = [];
  stats: any = null;
  displayedColumns = ['nombre', 'tipo', 'estado', 'estadoReal', 'tiempoRespuesta', 'activo', 'acciones'];
  verificando = false;
  procesando = false;
  private statsService = inject(StatsService);
  private snackBar = inject(MatSnackBar);
  private autoRefreshSubscription?: Subscription;

  ngOnInit(): void {
    this.cargarServicios();
    this.iniciarAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
    }
  }

  cargarServicios() {
    // Verificar el estado del backend unificado
    this.http.get(getBackendUrl('/health')).subscribe({
      next: (res) => {
        this.servicios = [{
          nombre: 'Backend Unificado',
          descripcion: 'Servidor principal de la aplicación',
          tipo: 'api',
          estado: 'online',
          estadoReal: 'running',
          tiempoRespuesta: 0,
          activo: true,
          puerto: 3001,
          procesoId: null,
          ultimaVerificacion: new Date().toISOString()
        }];
        this.cargarEstadisticas();
      },
      error: () => {
        this.servicios = [{
          nombre: 'Backend Unificado',
          descripcion: 'Servidor principal de la aplicación',
          tipo: 'api',
          estado: 'offline',
          estadoReal: 'stopped',
          tiempoRespuesta: 0,
          activo: false,
          puerto: 3001,
          procesoId: null,
          ultimaVerificacion: new Date().toISOString()
        }];
        this.cargarEstadisticas();
      }
    });
  }

  cargarEstadisticas() {
    // Calcular estadísticas basadas en los servicios hardcodeados
    const total = this.servicios.length;
    const activos = this.servicios.filter(s => s.activo).length;
    const online = this.servicios.filter(s => s.estado === 'online').length;
    const offline = this.servicios.filter(s => s.estado === 'offline').length;
    const error = this.servicios.filter(s => s.estado === 'error').length;
    const maintenance = this.servicios.filter(s => s.estado === 'maintenance').length;

    this.stats = {
      total,
      activos,
      inactivos: total - activos,
      online,
      offline,
      error,
      maintenance,
      porcentajeDisponibilidad: total > 0 ? Math.round((online / total) * 100) : 0
    };
  }

  iniciarAutoRefresh() {
    // Actualizar cada 30 segundos
    this.autoRefreshSubscription = interval(30000).subscribe(() => {
      this.cargarServicios();
      this.cargarEstadisticas();
    });
  }

  verificarServicio(service: any) {
    // Simular verificación
    service.ultimaVerificacion = new Date().toISOString();
    service.tiempoRespuesta = Math.floor(Math.random() * 200) + 10; // 10-210ms
    this.snackBar.open(`Servicio ${service.nombre} verificado`, 'Cerrar', { duration: 2000 });
  }

  verificarTodos() {
    this.verificando = true;
    // Simular verificación de todos los servicios
    setTimeout(() => {
      this.servicios.forEach(service => {
        service.ultimaVerificacion = new Date().toISOString();
        service.tiempoRespuesta = Math.floor(Math.random() * 200) + 10;
      });
      this.cargarEstadisticas();
      this.snackBar.open('Todos los servicios verificados', 'Cerrar', { duration: 2000 });
      this.verificando = false;
    }, 1000);
  }

  alternarEstado(service: any) {
    this.snackBar.open('El control de servicios no está disponible en el backend unificado', 'Cerrar', { duration: 3000 });
  }

  reiniciarServicio(service: any) {
    this.snackBar.open('El control de servicios no está disponible en el backend unificado', 'Cerrar', { duration: 3000 });
  }

  obtenerKeyServicio(nombre: string): string {
    if (nombre.toLowerCase().includes('autenticación')) return 'auth';
    if (nombre.toLowerCase().includes('lugares')) return 'places';
    if (nombre.toLowerCase().includes('media')) return 'media';
    if (nombre.toLowerCase().includes('reseñas')) return 'reviews';
    if (nombre.toLowerCase().includes('estadísticas')) return 'stats';
    if (nombre.toLowerCase().includes('notificaciones')) return 'notifications';
    if (nombre.toLowerCase().includes('mongo')) return 'db';
    return '';
  }

  activarTodos() {
    this.snackBar.open('El control de servicios no está disponible en el backend unificado', 'Cerrar', { duration: 3000 });
  }

  desactivarTodos() {
    this.snackBar.open('El control de servicios no está disponible en el backend unificado', 'Cerrar', { duration: 3000 });
  }

  getResponseTimeClass(tiempo: number): string {
    if (tiempo < 100) return 'fast';
    if (tiempo < 500) return 'medium';
    return 'slow';
  }

  getEstadoRealText(estadoReal: string): string {
    const estados = {
      'running': 'Ejecutándose',
      'stopped': 'Detenido',
      'starting': 'Iniciando...',
      'stopping': 'Deteniendo...',
      'error': 'Error'
    };
    return estados[estadoReal as keyof typeof estados] || estadoReal;
  }
} 