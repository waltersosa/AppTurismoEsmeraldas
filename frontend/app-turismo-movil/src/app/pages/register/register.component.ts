import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
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
      this.http.post<any>('http://localhost:3001/auth/register', this.registerForm.value).subscribe({
        next: (resp) => {
          this.successMsg = '¡Registro exitoso! Ahora puedes iniciar sesión.';
          setTimeout(() => {
            this.successMsg = null;
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.errorMsg = err.error?.error || 'Error al registrar usuario';
        }
      });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
