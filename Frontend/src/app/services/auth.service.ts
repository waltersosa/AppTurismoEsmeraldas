import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la estructura de los datos que se enviarán al servidor al registrarse
interface RegisterData {
  nombre: string;
  correo: string;
  contraseña: string;
  rol: string; 
}

interface LoginData {
  correo: string;
  contraseña: string;  
}

//Ijectable permite que el servicio AuthService sea inyectable en otros componentes o 
// servicios de Angular. Es decir que puedes usarlo en cualquier parte la aplicación
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'http://localhost:3001/auth/register'; //Endpoint de la API para el registro
  private loginUrl = 'http://localhost:3001/auth/login'; //Endpoint de la API para el inicio de sesión

  constructor(private http: HttpClient) {} //Permite hacer peticiones HTTP

  register(data: RegisterData): Observable<any> {
    return this.http.post(this.registerUrl, data);
  }
  login(data: LoginData): Observable<any> {
    return this.http.post(this.loginUrl, data);
  }
}
