import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.errorMsg = null;
      this.successMsg = null;
      this.isLoading = true;

      console.log('📝 Iniciando registro en BD local...');

      this.authService.register(this.registerForm.value).subscribe({
        next: (resp) => {
          console.log('✅ Registro exitoso:', resp);
          this.successMsg = '¡Registro exitoso! Ahora puedes iniciar sesión.';
          this.isLoading = false;
          setTimeout(() => {
            this.successMsg = null;
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          console.error('❌ Error en registro:', err);
          this.errorMsg = err.error?.error || err.message || 'Error al registrar usuario';
          this.isLoading = false;
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
