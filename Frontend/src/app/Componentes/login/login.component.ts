import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Permite usar directivas comunes como ngIf, ngFor, etc.
import { HttpClientModule } from '@angular/common/http'; // Permite hacer peticiones HTTP
import { AuthService } from '../../services/auth.service'; // Importamos el servicio de autenticación
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Indica que este componente es independiente y no depende de otros módulos
  imports: [FormsModule, CommonModule, /*HttpClientModule*/], // Importamos los módulos necesarios
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }
  onSubmit() {
    if (this.email && this.password) {
      this.authService.login({
        email: this.email,
        password: this.password
      }).subscribe({
        next: (response) => {
          const token = response.data?.token;
        console.log("token:", response.data?.token)
        console.log("id del usuario:", response.data?.userid)
          localStorage.setItem('token', response.data?.token); // Guarda el token en el almacenamiento local
          localStorage.setItem('userId', response.data?.userid); // Guarda el userId en el almacenamiento local
          this.router.navigate(['/inicio']); // Redirige a la página de inicio
        },
        error: (err) => {
          if (err.error?.errors) {
            const mensajes = err.error.errors.map((e: any) => e.msg).join('\n');
            alert(mensajes);
          } else {
            alert('Error al iniciar sesión: ' + err.error?.message || 'Error desconocido');
          }
        }
      });
    }
  }
}
