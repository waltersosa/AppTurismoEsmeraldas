import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {
  nombre: string = '';
  correo: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.authService.obtenerPerfil().subscribe({
      next: (response) => {

        this.nombre = response.data.usuario.nombre || '';
        this.correo = response.data.usuario.correo || '';

        console.log("this.nombre", response.data);
      },
      error: (error) => {
        console.error('Error al obtener el perfil:', error);
        console.log('')
      }
    });
  }

}
