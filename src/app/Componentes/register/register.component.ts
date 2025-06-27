import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';

  onSubmit() {
    if (this.username && this.password && this.email) {
      alert('Registro exitoso!');
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
}
