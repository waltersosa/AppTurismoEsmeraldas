import { Routes } from '@angular/router';
import { Login } from './auth/login';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/home/home.component';
import { authGuard } from './auth/auth.guard';
import { UsuariosComponent } from './dashboard/usuarios/usuarios.component';
import { ReviewComponent } from './dashboard/review/review.component';
import { PlaceComponent } from './dashboard/place/place.component';
import { ServiciosComponent } from './dashboard/servicios/servicios.component';

export const routes: Routes = [
  { path: 'auth/login', component: Login },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'review', component: ReviewComponent },
      { path: 'place', component: PlaceComponent },
      { path: 'servicios', component: ServiciosComponent },
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
