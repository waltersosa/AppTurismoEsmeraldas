import { Routes } from '@angular/router';
import { Login } from './auth/login';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'auth/login', component: Login },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      // Aquí puedes agregar más rutas del dashboard como:
      // { path: 'usuarios', component: UsuariosComponent },
      // { path: 'destinos', component: DestinosComponent },
      // { path: 'reservas', component: ReservasComponent },
      // { path: 'reportes', component: ReportesComponent },
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
