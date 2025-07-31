import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.errorMsg = null;
      this.successMsg = null;
      this.isLoading = true;

      const credentials: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response.success && response.data) {
            // Debug: ver la estructura del usuario
            console.log('Login response:', response);
            console.log('User object:', response.data.user);
            
            // Guardar datos de autenticación
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userid || response.data.user?._id || response.data.user?.id || '');
            
            // Normalizar y guardar datos del usuario
            const normalizedUser = this.authService.normalizeUser(response.data.user);
            console.log('Normalized user:', normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
            
            this.successMsg = '¡Inicio de sesión exitoso!';
            setTimeout(() => {
              this.successMsg = null;
              this.router.navigate(['/home']);
            }, 1200);
          } else {
            this.errorMsg = response.message || 'Error al iniciar sesión';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en login:', error);
          
          // Mensajes de error más específicos
          if (error.status === 401) {
            this.errorMsg = 'Credenciales incorrectas';
          } else if (error.status === 0) {
            this.errorMsg = 'Error de conexión. Verifica tu conexión a internet';
          } else {
            this.errorMsg = error.error?.message || error.message || 'Error al iniciar sesión';
          }
        }
      });
    }
  }
}
