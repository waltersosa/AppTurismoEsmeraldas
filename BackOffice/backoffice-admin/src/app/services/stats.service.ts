import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getBackendUrl } from '../config/api.config';

export interface StatsOverview {
  success: boolean;
  data: {
    totalUsers: number;
    totalPlaces: number;
    totalReviews: number;
    totalImages: number;
    recentActivity: any[];
  };
}

export interface HealthOverview {
  success: boolean;
  data: {
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: {
      [key: string]: {
        status: 'online' | 'offline' | 'error';
        uptime: number;
        memory: number;
        connections: number;
      };
    };
  };
}

export interface SimpleHealth {
  success: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy';
  servicesOnline: number;
  totalServices: number;
}

export interface ServiceHealth {
  success: boolean;
  data: {
    status: 'online' | 'offline' | 'error';
    uptime: number;
    memory: number;
    connections: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private http: HttpClient) { }

  // Obtener health check completo
  getHealthOverview(): Observable<HealthOverview> {
    return this.http.get<HealthOverview>(getBackendUrl('/health'));
  }

  // Obtener métricas de usuarios
  getUsersStats(): Observable<any> {
    return this.http.get<any>(getBackendUrl('/auth/users/count'));
  }

  // Obtener métricas de lugares
  getPlacesStats(): Observable<any> {
    return this.http.get<any>(getBackendUrl('/places/count'));
  }

  // Obtener métricas de reseñas
  getReviewsStats(): Observable<any> {
    return this.http.get<any>(getBackendUrl('/reviews/count'));
  }

  // Obtener métricas de imágenes
  getMediaStats(): Observable<any> {
    return this.http.get<any>(getBackendUrl('/media/count'));
  }

  // Obtener actividades recientes
  getRecentActivity(): Observable<any> {
    return this.http.get<any>(getBackendUrl('/activities/recent'));
  }
} 