import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getStatsServiceUrl } from '../config/api.config';

export interface StatsOverview {
  usuarios: number;
  lugares: number;
  resenas: number;
  imagenes: number;
}

export interface ServiceHealth {
  service: string;
  url: string;
  port: number;
  status: 'online' | 'offline';
  responseTime: string;
  statusCode: number | string;
  timestamp: string;
  data?: any;
  error?: string;
}

export interface HealthOverview {
  overall: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    onlineServices: number;
    totalServices: number;
    uptime: string;
    timestamp: string;
  };
  services: ServiceHealth[];
}

export interface SimpleHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  online: number;
  total: number;
  timestamp: string;
  services: Array<{
    name: string;
    status: 'online' | 'offline';
    port: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);

  // Obtener estadísticas generales
  getStatsOverview(): Observable<StatsOverview> {
    return this.http.get<StatsOverview>(getStatsServiceUrl('/stats/overview'));
  }

  // Obtener health check completo de todos los servicios
  getAllServicesHealth(): Observable<HealthOverview> {
    return this.http.get<HealthOverview>(getStatsServiceUrl('/health'));
  }

  // Obtener health check simplificado
  getSimpleHealth(): Observable<SimpleHealth> {
    return this.http.get<SimpleHealth>(getStatsServiceUrl('/health/simple'));
  }

  // Obtener health check de un servicio específico
  getServiceHealth(serviceName: string): Observable<ServiceHealth> {
    return this.http.get<ServiceHealth>(getStatsServiceUrl(`/health/${serviceName}`));
  }

  // Verificar si todos los servicios están funcionando
  isSystemHealthy(): Observable<boolean> {
    return new Observable(observer => {
      this.getSimpleHealth().subscribe({
        next: (health) => {
          observer.next(health.status === 'healthy');
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  // Obtener servicios offline
  getOfflineServices(): Observable<ServiceHealth[]> {
    return new Observable(observer => {
      this.getAllServicesHealth().subscribe({
        next: (health) => {
          const offlineServices = health.services.filter(service => service.status === 'offline');
          observer.next(offlineServices);
          observer.complete();
        },
        error: () => {
          observer.next([]);
          observer.complete();
        }
      });
    });
  }

  // Obtener tiempo de respuesta promedio
  getAverageResponseTime(): Observable<number> {
    return new Observable(observer => {
      this.getAllServicesHealth().subscribe({
        next: (health) => {
          const onlineServices = health.services.filter(service => service.status === 'online');
          if (onlineServices.length === 0) {
            observer.next(0);
            observer.complete();
            return;
          }

          const totalTime = onlineServices.reduce((sum, service) => {
            const timeMs = parseInt(service.responseTime.replace('ms', ''));
            return sum + (isNaN(timeMs) ? 0 : timeMs);
          }, 0);

          observer.next(totalTime / onlineServices.length);
          observer.complete();
        },
        error: () => {
          observer.next(0);
          observer.complete();
        }
      });
    });
  }
} 