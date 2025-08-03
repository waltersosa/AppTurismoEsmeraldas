import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Si el usuario ya está autenticado y tiene permisos, redirigir al dashboard
    if (this.authService.isAuthenticated() && this.authService.canAccessBackOffice()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.loginForm.value)
      .subscribe({
        next: (response) => {
          console.log('Respuesta login:', response);
          console.log('Usuario actual:', this.authService.getCurrentUser());
          if (response.success) {
            const user = response.data?.usuario;
            if (user && user.rol === 'admin') {
              setTimeout(() => { 
                this.router.navigate(['/dashboard']);
              }, 0);
            } else {
              this.errorMsg = 'No tienes permisos para acceder al BackOffice. Solo administradores pueden acceder.';
              this.authService.logout();
              this.loading = false;
            }
          } else {
            this.errorMsg = response.message || 'Error al iniciar sesión';
            this.loading = false;
          }
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Error al iniciar sesión';
          this.loading = false;
        },
        complete: () => this.loading = false
      });
  }
}
