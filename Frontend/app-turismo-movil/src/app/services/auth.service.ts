import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaces para los datos de autenticación
interface RegisterData {
  nombre: string;
  correo: string;
  contraseña: string;
  rol: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    userid: string;
    usuario: any;
  };
  token?: string;
  userId?: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  /**
   * Login híbrido: intenta primero con BD local, luego con API del municipio
   */
  login(data: LoginData): Observable<LoginResponse> {
    console.log('🔐 Iniciando login híbrido...');
    
    // Primero intenta con la base de datos local
    return this.http.post<LoginResponse>(environment.auth.local.login, {
      correo: data.email,
      contraseña: data.password
    }).pipe(
      catchError((localError) => {
        console.log('❌ Login local falló, intentando con municipio...');
        
        // Si falla local, intenta con la API del municipio
        return this.http.post<LoginResponse>(environment.auth.municipio.login, {
          email: data.email,
          password: data.password
        }).pipe(
          catchError((municipioError) => {
            console.error('❌ Ambos sistemas fallaron');
            return throwError(() => new Error('Credenciales inválidas en ambos sistemas'));
          })
        );
      })
    );
  }

  /**
   * Registro solo en base de datos local
   */
  register(data: RegisterData): Observable<any> {
    console.log('📝 Registrando usuario en BD local...');
    return this.http.post(environment.auth.local.register, data);
  }

  /**
   * Obtener perfil solo desde base de datos local
   */
  obtenerPerfil(): Observable<any> {
    console.log('👤 Obteniendo perfil desde BD local...');
    return this.http.get<{
      success: boolean;
      message: string;
      timestamp: string;
      data: {
        usuario: {
          id: string;
          nombre: string;
          correo: string;
          rol: string;
          fechaCreacion: string;
          ultimoAcceso: string;
        }
      }
    }>(environment.auth.local.profile);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Obtener token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Obtener ID del usuario del localStorage
   */
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  /**
   * Obtener datos del usuario del localStorage
   */
  getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    console.log('🚪 Sesión cerrada');
  }
} 