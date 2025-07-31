import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { getBackendUrl, getMunicipalityUrl } from '../config/api.config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: any;
    userid?: string;
  };
  message?: string;
}

export interface User {
  id?: string;
  userid?: string;
  nombre?: string;
  name?: string;
  email?: string;
  correo?: string;
  rol?: string;
  role?: string;
  activo?: boolean;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  /**
   * Login híbrido: intenta primero con el backend local, luego con la API del municipio
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.tryLocalLogin(credentials).pipe(
      switchMap(localResult => {
        if (localResult) {
          return of(localResult);
        } else {
          console.log('Login local falló, intentando con API del municipio...');
          return this.tryMunicipalityLogin(credentials);
        }
      }),
      catchError(error => {
        console.error('Error en login híbrido:', error);
        throw error;
      })
    );
  }

  /**
   * Intenta login con el backend local
   * Retorna null si falla (en lugar de throw error) para permitir fallback
   */
  private tryLocalLogin(credentials: LoginRequest): Observable<LoginResponse | null> {
    const loginData = {
      correo: credentials.email,
      contraseña: credentials.password
    };

    return this.http.post<any>(getBackendUrl('/auth/login'), loginData).pipe(
      map(response => {
        if (response.success) {
          // Normalizar respuesta del backend local
          return {
            success: true,
            data: {
              token: response.data.token,
              user: response.data.usuario,
              userid: response.data.usuario._id
            }
          };
        } else {
          return null;
        }
      }),
      catchError(error => {
        console.log('Login local falló (manejado internamente):', error.status);
        // Retornar null en lugar de throw para permitir fallback
        return of(null);
      })
    );
  }

  /**
   * Intenta login con la API del municipio
   */
  private tryMunicipalityLogin(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(getMunicipalityUrl('/login'), credentials).pipe(
      map(response => {
        console.log('Municipality API response:', response);
        
        if (response.success || response.data) {
          // Buscar el token y userid en diferentes ubicaciones posibles
          let token = response.data?.token || response.token;
          let userid = response.data?.userid || response.userid;
          
          console.log('Extracted token:', token);
          console.log('Extracted userid:', userid);
          
          // Crear un objeto de usuario mínimo con la información disponible
          let user = {
            id: userid,
            userid: userid,
            email: credentials.email, // Usar el email del login
            correo: credentials.email,
            nombre: `Usuario (${credentials.email.split('@')[0]})`, // Usar parte del email como nombre
            name: `Usuario (${credentials.email.split('@')[0]})`,
            rol: 'usuario',
            role: 'usuario',
            activo: true,
            active: true
          };
          
          console.log('Created user object:', user);
          
          // Normalizar respuesta de la API del municipio
          return {
            success: true,
            data: {
              token: token,
              user: user,
              userid: userid
            }
          };
        } else {
          throw new Error(response.message || 'Error en login del municipio');
        }
      }),
      catchError(error => {
        console.error('Error en login del municipio:', error);
        throw error;
      })
    );
  }

  /**
   * Intenta obtener detalles adicionales del usuario desde la API del municipio
   */
  private fetchMunicipalityUserDetails(token: string): Observable<User | null> {
    return this.http.get<any>(getMunicipalityUrl('/me'), {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => {
        console.log('Municipality user details response:', response);
        
        if (response.success || response.data) {
          // Intentar extraer información del usuario de la respuesta
          const userData = response.data || response;
          
          // Si tenemos información adicional, actualizar el usuario
          if (userData.name || userData.nombre || userData.email) {
            const enhancedUser = {
              id: userData.userid || userData.id,
              userid: userData.userid || userData.id,
              email: userData.email || userData.correo,
              correo: userData.correo || userData.email,
              nombre: userData.nombre || userData.name || userData.first_name,
              name: userData.name || userData.nombre || userData.first_name,
              rol: userData.rol || userData.role || 'usuario',
              role: userData.role || userData.rol || 'usuario',
              activo: userData.activo !== undefined ? userData.activo : true,
              active: userData.active !== undefined ? userData.active : true
            };
            
            console.log('Enhanced user from municipality API:', enhancedUser);
            return this.normalizeUser(enhancedUser);
          }
        }
        return null;
      }),
      catchError(error => {
        console.log('Error fetching municipality user details:', error);
        return of(null);
      })
    );
  }

  /**
   * Obtiene información del usuario autenticado
   */
  getUserInfo(): Observable<User | null> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return of(null);
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      return of(null);
    }

    // Primero intentar obtener desde localStorage si ya tenemos datos del usuario
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      console.log('Usando datos de usuario desde localStorage');
      
      // Si el usuario tiene información mínima (solo email y nombre genérico), intentar obtener más detalles
      if (currentUser.nombre && currentUser.nombre.includes('Usuario (')) {
        console.log('Usuario con información mínima, intentando obtener detalles adicionales...');
        return this.fetchMunicipalityUserDetails(token).pipe(
          switchMap(enhancedUser => {
            if (enhancedUser) {
              // Actualizar localStorage con la información mejorada
              localStorage.setItem('user', JSON.stringify(enhancedUser));
              return of(enhancedUser);
            } else {
              return of(currentUser);
            }
          })
        );
      }
      
      return of(currentUser);
    }

    // Si no hay datos en localStorage, intentar obtener del servidor
    // Intentar obtener info del backend local primero
    return this.http.get<any>(getBackendUrl('/auth/profile'), {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(response => {
        if (response.success) {
          const user = this.normalizeUser(response.data.usuario);
          // Guardar en localStorage para futuras consultas
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        }
        return null;
      }),
      switchMap(localUser => {
        if (localUser) {
          return of(localUser);
        } else {
          console.log('Error obteniendo perfil local, intentando con API del municipio...');
          // Intentar con API del municipio
          return this.fetchMunicipalityUserDetails(token).pipe(
            switchMap(municipalityUser => {
              if (municipalityUser) {
                // Guardar en localStorage para futuras consultas
                localStorage.setItem('user', JSON.stringify(municipalityUser));
                return of(municipalityUser);
              } else {
                return of(null);
              }
            })
          );
        }
      }),
      catchError(error => {
        // Manejar errores 401/400/403/404 del backend local
        if (error.status && [401, 400, 403, 404].includes(error.status)) {
          console.log('Error de autenticación manejado internamente:', error.status);
          return of(null);
        }
        // Para otros errores, también retornar null en lugar de throw
        console.log('Error general obteniendo perfil (manejado internamente):', error);
        return of(null);
      })
    );
  }

  /**
   * Normaliza la estructura del usuario para consistencia
   */
  normalizeUser(user: any): User {
    // Verificar que user no sea null o undefined
    if (!user) {
      return {
        id: undefined,
        userid: undefined,
        nombre: undefined,
        name: undefined,
        email: undefined,
        correo: undefined,
        rol: undefined,
        role: undefined,
        activo: undefined,
        active: undefined
      };
    }

    return {
      id: user._id || user.id || user.userid || undefined,
      userid: user.userid || user._id || user.id || undefined,
      nombre: user.nombre || user.name || undefined,
      name: user.name || user.nombre || undefined,
      email: user.email || user.correo || undefined,
      correo: user.correo || user.email || undefined,
      rol: user.rol || user.role || undefined,
      role: user.role || user.rol || undefined,
      activo: user.activo !== undefined ? user.activo : (user.active !== undefined ? user.active : undefined),
      active: user.active !== undefined ? user.active : (user.activo !== undefined ? user.activo : undefined)
    };
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
    }
  }

  /**
   * Obtiene el token actual
   */
  getToken(): string | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    return localStorage.getItem('token');
  }

  /**
   * Obtiene el usuario actual desde localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return this.normalizeUser(JSON.parse(userStr));
      } catch {
        return null;
      }
    }
    return null;
  }
} 