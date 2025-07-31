import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export function authInterceptor(
  request: HttpRequest<unknown>, 
  next: HttpHandlerFn
) {
  const router = inject(Router);
  
  // Obtener token del localStorage (solo si está disponible)
  let token: string | null = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('token');
  }
  
  // Clonar la request y agregar el header de autorización si existe token
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 (Unauthorized), verificar si es parte del flujo híbrido
      if (error.status === 401) {
        const url = request.url;
        
        // Solo hacer logout para endpoints que no son parte del flujo híbrido
        // Los endpoints de auth/profile y auth/login son manejados internamente por AuthService
        const isHybridAuthEndpoint = url.includes('/auth/profile') || 
                                   url.includes('/auth/login') ||
                                   url.includes('/me');
        
        if (!isHybridAuthEndpoint) {
          console.log('401 error en endpoint no híbrido, haciendo logout:', url);
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('user');
          }
          router.navigate(['/login']);
        } else {
          console.log('401 error en endpoint híbrido, manejado por AuthService:', url);
        }
      }
      
      return throwError(() => error);
    })
  );
} 