import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Place {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  images: string[];
  coverImage: string;
  active: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlacesResponse {
  success: boolean;
  data: Place[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface PlaceResponse {
  success: boolean;
  data: Place;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private apiUrl = 'http://localhost:3001/places';

  constructor(private http: HttpClient) { }

  // Obtener todos los lugares con filtros opcionales
  getPlaces(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    active?: boolean;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Observable<PlacesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('search', params.search);
    if (params?.category) queryParams.set('category', params.category);
    if (params?.active !== undefined) queryParams.set('active', params.active.toString());
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params?.order) queryParams.set('order', params.order);

    const url = queryParams.toString() ? `${this.apiUrl}?${queryParams.toString()}` : this.apiUrl;
    
    return this.http.get<PlacesResponse>(url);
  }

  // Obtener lugar por ID
  getPlaceById(id: string): Observable<PlaceResponse> {
    return this.http.get<PlaceResponse>(`${this.apiUrl}/${id}`);
  }

  // Obtener lugares por categoría
  getPlacesByCategory(category: string): Observable<PlacesResponse> {
    return this.getPlaces({ category, active: true, limit: 20 });
  }

  // Obtener lugares activos
  getActivePlaces(): Observable<PlacesResponse> {
    return this.getPlaces({ active: true, limit: 20 });
  }

  // Buscar lugares por nombre
  searchPlaces(searchTerm: string): Observable<PlacesResponse> {
    return this.getPlaces({ search: searchTerm, active: true });
  }

  // Obtener conteo total de lugares
  getPlacesCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`);
  }

  // Crear nuevo lugar (solo para usuarios autenticados)
  createPlace(placeData: Partial<Place>): Observable<PlaceResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<PlaceResponse>(this.apiUrl, placeData, { headers });
  }

  // Actualizar lugar (solo para usuarios autenticados)
  updatePlace(id: string, placeData: Partial<Place>): Observable<PlaceResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<PlaceResponse>(`${this.apiUrl}/${id}`, placeData, { headers });
  }

  // Cambiar estado de lugar (solo para usuarios autenticados)
  updatePlaceStatus(id: string, active: boolean): Observable<PlaceResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch<PlaceResponse>(`${this.apiUrl}/${id}/status`, { active }, { headers });
  }

  // Eliminar lugar (solo para usuarios autenticados)
  deletePlace(id: string): Observable<PlaceResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<PlaceResponse>(`${this.apiUrl}/${id}`, { headers });
  }
}
