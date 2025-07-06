import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { getApiUrl } from '../config/api.config';

export interface User {
  _id: string;
  nombre: string;
  correo: string;
  rol: 'admin' | 'usuario' | 'gad';
  fechaCreacion: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  data?: {
    usuario: User;
    token: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: { correo: string; contraseña: string }): Observable<LoginResponse> {
    return this.http.post<any>(getApiUrl('/auth/login'), credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            const user = response.data?.usuario || response.user;
            const token = response.data?.token || response.token;
            if (user && token) {
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));
              this.currentUserSubject.next(user);
            }
          }
        })
      );
  }

  register(userData: { nombre: string; correo: string; contraseña: string; rol?: string }): Observable<any> {
    return this.http.post<any>(getApiUrl('/auth/register'), userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isGad(): boolean {
    return this.hasRole('gad');
  }

  canAccessBackOffice(): boolean {
    return this.hasRole('gad');
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        this.logout();
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  validateToken(): Observable<any> {
    return this.http.get<any>(getApiUrl('/auth/validate'));
  }

  // Puedes agregar más métodos aquí, como logout, register, etc.
} 