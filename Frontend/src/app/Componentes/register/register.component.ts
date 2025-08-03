import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; //Permite usar directivas comunes como ngIf, ngFor, etc.
import { HttpClientModule } from '@angular/common/http'; //Permite hacer peticiones HTTP
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true, //Indica que este componente es independiente y no depende de otros módulos
  imports: [FormsModule, CommonModule, HttpClientModule], //Importamos los módulos necesarios
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  //Variables para almacenar los datos del formulario
  nombre: string = '';
  correo: string = '';
  password: string = '';


  //¿Recuerdas que dije que podias inyectar AuthService para hacer peticiones http?
  //Pues aquí lo hacemos.
  constructor(private authService: AuthService) { }

  onSubmit() {
    if (this.nombre && this.password && this.correo) {
      this.authService.register({
        nombre: this.nombre,
        correo: this.correo,
        contraseña: this.password,
        rol: 'usuario'
      }).subscribe({
        next: () => alert('Registro exitoso'),
        error: (err) => {
          if (err.error?.errors) {
            const mensajes = err.error.errors.map((e: any) => e.msg).join('\n');
            alert(mensajes);
          } else {
            alert('Error al registrar usuario: ' + err.error?.message || 'Error desconocido');
          }
        }

      });
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
