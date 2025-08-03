import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { getAuthUrl, getBackendUrl } from '../config/api.config';

export interface User {
  _id?: string;
  nombre: string;
  correo: string;
  rol: 'usuario' | 'propietario' | 'admin';
  activo: boolean;
  fechaCreacion?: Date;
  ultimoAcceso?: Date;
}

export interface LoginCredentials {
  correo: string;
  contraseña: string;
}

export interface RegisterData {
  nombre: string;
  correo: string;
  contraseña: string;
  rol: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    usuario: User;
    token: string;
  };
}

export interface UsersResponse {
  success: boolean;
  data: User[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  /**
   * Login local para administradores del BackOffice
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(getAuthUrl('/login'), credentials).pipe(
      tap((response: AuthResponse) => {
        if (response.success && response.data?.usuario) {
          this.setUserAndToken(response.data.usuario, response.data.token);
        }
      })
    );
  }

  /**
   * Registrar usuario solo en base local
   */
  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(getAuthUrl('/register'), userData).pipe(
      tap((response: AuthResponse) => {
        if (response.success && response.data?.usuario) {
          this.setUserAndToken(response.data.usuario, response.data.token);
        }
      })
    );
  }

  /**
   * Establecer usuario y token en localStorage
   */
  private setUserAndToken(user: User, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.currentUserSubject.next(user);
  }

  /**
   * Cargar usuario desde localStorage
   */
  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Obtener token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verificar si el usuario puede acceder al BackOffice
   */
  canAccessBackOffice(): boolean {
    const user = this.getCurrentUser();
    return user ? (user.rol === 'admin') : false;
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    const currentUser = this.getCurrentUser();
    
    // Registrar logout en el backend si hay usuario
    if (currentUser && currentUser._id) {
      this.http.post(getAuthUrl('/logout'), {}, {
        headers: { 'Authorization': `Bearer ${this.getToken()}` }
      }).subscribe({
        next: () => console.log('Logout registrado en el backend'),
        error: (error) => console.error('Error al registrar logout:', error)
      });
    }
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Validar token
   */
  validateToken(): Observable<any> {
    return this.http.get<any>(getAuthUrl('/validate'));
  }

  /**
   * Obtener todos los usuarios (solo admin)
   */
  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(getAuthUrl('/users'));
  }

  /**
   * Crear usuario (solo admin)
   */
  createUser(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(getAuthUrl('/users'), userData);
  }

  /**
   * Actualizar usuario (solo admin)
   */
  updateUser(userId: string, userData: Partial<User>): Observable<any> {
    return this.http.put<any>(getAuthUrl(`/users/${userId}`), userData);
  }

  /**
   * Eliminar usuario (solo admin)
   */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(getAuthUrl(`/users/${userId}`));
  }

  /**
   * Obtener conteo de usuarios
   */
  getUsersCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(getAuthUrl('/users/count'));
  }
} 