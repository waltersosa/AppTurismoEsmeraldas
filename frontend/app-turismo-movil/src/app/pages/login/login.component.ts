import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  isLoading: boolean = false;

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

      console.log('🔐 Iniciando proceso de login híbrido...');

      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }).subscribe({
        next: (resp) => {
          console.log('✅ Login exitoso:', resp);
          
          // Manejar diferentes formatos de respuesta
          const token = resp.data?.token || resp.token;
          const userId = resp.data?.userid || resp.userId;
          const user = resp.data?.usuario || resp.user;

          // Guardar datos en localStorage
          if (token) {
            localStorage.setItem('token', token);
          }
          if (userId) {
            localStorage.setItem('userId', userId);
          }
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }

          this.successMsg = '¡Inicio de sesión exitoso!';
          this.isLoading = false;
          
          setTimeout(() => {
            this.successMsg = null;
            this.router.navigate(['/home']);
          }, 1200);
        },
        error: (err) => {
          console.error('❌ Error en login:', err);
          this.errorMsg = err.error?.error || err.message || 'Error al iniciar sesión';
          this.isLoading = false;
        }
      });
    }
  }
}
