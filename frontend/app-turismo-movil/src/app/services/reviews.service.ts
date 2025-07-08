import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  _id?: string;
  placeId?: string;
  lugarId?: string;
  userName?: string;
  usuarioId?: string | { _id: string; nombre?: string };
  comment?: string;
  comentario?: string;
  rating?: number;
  calificacion?: number;
  createdAt?: string;
  fecha?: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
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
  private apiUrl = 'http://localhost:3004/reviews'; // Cambia el puerto si tu microservicio usa otro

  constructor(private http: HttpClient) { }

  // Obtener reseñas de un lugar
  getReviewsByPlace(placeId: string): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.apiUrl}/lugar/${placeId}`);
  }

  // Agregar una nueva reseña
  addReview(review: ReviewPayload): Observable<ReviewResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<ReviewResponse>(this.apiUrl, review, { headers });
  }

  // Editar reseña
  updateReview(id: string, review: ReviewPayload): Observable<ReviewResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<ReviewResponse>(`${this.apiUrl}/${id}`, review, { headers });
  }

  // Eliminar reseña
  deleteReview(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
}
