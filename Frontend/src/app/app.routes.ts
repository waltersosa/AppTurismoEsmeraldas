import { Routes } from '@angular/router';
import { LoginComponent } from './Componentes/login/login.component';
import {RegisterComponent} from './Componentes/register/register.component';
import { InicioComponent } from './Componentes/inicio/inicio.component';
import { LugaresTuristicosComponent } from './Componentes/lugares-turisticos/lugares-turisticos.component';

//Aquí estamos declarando una constante llamada routes que es un arreglo de rutas
export const routes: Routes = [
    {path: 'login', component: LoginComponent}, //Esta es una ruta, que indica que cuando la URL sea '/login', se cargará el componente LoginComponent
    {path: 'register', component: RegisterComponent}, //Lo mismo que la anterior, pero para el componente RegisterComponent
    {path: '', redirectTo: '/login', pathMatch: 'full'}, //Aquí indicamos que si la URL está vacía, se redirigirá a '/login'. 'pathMatch: full' significa que la ruta debe coincidir exactamente con la URL para redirigir.
    {path: 'inicio', component: InicioComponent},
    {path: 'lugares-turisticos', component: LugaresTuristicosComponent}, // Lugares turísticos
];
