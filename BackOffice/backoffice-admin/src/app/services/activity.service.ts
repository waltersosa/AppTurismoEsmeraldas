import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getPlacesUrl } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private http: HttpClient) { }

  getUnifiedActivities(): Observable<any> {
    return this.http.get<any>(getPlacesUrl('/admin/actividades-unificadas'));
  }
} 