import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getBackendUrl } from '../config/api.config';

export interface Review {
  _id?: string;
  lugarId?: string;
  usuarioId?: string | { _id: string; nombre?: string };
  comentario?: string;
  calificacion?: number;
  estado?: string;
  fecha?: string;
  createdAt?: string;
  updatedAt?: string;
  userName?: string;
  usuario?: { nombre?: string; email?: string };
  lugar?: { name?: string };
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
}

export interface ReviewPayload {
  lugarId: string;
  comentario: string;
  calificacion: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = getBackendUrl('/reviews');

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('token') : null;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener reseñas de un lugar
  getReviewsByPlace(placeId: string): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.apiUrl}/lugar/${placeId}`).pipe(
      catchError(error => {
        console.error('Error obteniendo reseñas:', error);
        return throwError(() => error);
      })
    );
  }

  // Agregar una nueva reseña
  addReview(review: ReviewPayload): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.apiUrl, review, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Error agregando reseña:', error);
        return throwError(() => error);
      })
    );
  }

  // Editar reseña
  updateReview(id: string, review: Partial<ReviewPayload>): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${this.apiUrl}/${id}`, review, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Error actualizando reseña:', error);
        return throwError(() => error);
      })
    );
  }

  // Eliminar reseña
  deleteReview(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        console.error('Error eliminando reseña:', error);
        return throwError(() => error);
      })
    );
  }

  // Verificar si el usuario ya ha reseñado un lugar
  checkUserReview(placeId: string): Observable<ReviewResponse | null> {
    return this.http.get<ReviewResponse>(`${this.apiUrl}/user/${placeId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      catchError(error => {
        // Si no encuentra reseña, retornar null
        if (error.status === 404) {
          return throwError(() => null);
        }
        console.error('Error verificando reseña del usuario:', error);
        return throwError(() => error);
      })
    );
  }
}
