import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // Verificar si el usuario tiene acceso al BackOffice
      if (this.authService.canAccessBackOffice()) {
        return true;
      } else {
        // Usuario autenticado pero sin permisos para BackOffice
        this.authService.logout();
        return false;
      }
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthGuard).canActivate();
}; 