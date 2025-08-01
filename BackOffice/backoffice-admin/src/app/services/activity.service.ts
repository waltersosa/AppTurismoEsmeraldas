import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getPlacesServiceUrl } from '../config/api.config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private http: HttpClient) {}

  getUnifiedActivities(): Observable<any> {
    return this.http.get<any>(getPlacesServiceUrl('/admin/actividades-unificadas'));
  }
} 