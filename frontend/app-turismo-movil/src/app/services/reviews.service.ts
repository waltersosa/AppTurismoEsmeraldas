import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  _id?: string;
  placeId: string;
  userName: string;
  comment: string;
  rating: number;
  createdAt?: string;
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
    return this.http.get<ReviewsResponse>(`${this.apiUrl}/place/${placeId}`);
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
}
