import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/portada/portada.component').then(m => m.PortadaComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  
  // Rutas protegidas que requieren autenticación
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'places', 
    loadComponent: () => import('./pages/places/places.component').then(m => m.PlacesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'places/:id', 
    loadComponent: () => import('./pages/place-detail/place-detail.component').then(m => m.PlaceDetailComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'perfil', 
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'emergencias',
    loadComponent: () => import('./pages/emergencias/emergencias.component').then(m => m.EmergenciasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reportar-incidencia',
    loadComponent: () => import('./pages/reportar-incidencia/reportar-incidencia.component').then(m => m.ReportarIncidenciaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'eventos-noticias',
    loadComponent: () => import('./pages/eventos-noticias/eventos-noticias.component').then(m => m.EventosNoticiasComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'cultura-gastronomia',
    loadComponent: () => import('./pages/cultura-gastronomia/cultura-gastronomia.component').then(m => m.CulturaGastronomiaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'mapa-interactivo',
    loadComponent: () => import('./pages/mapa-interactivo/mapa-interactivo.component').then(m => m.MapaInteractivoComponent),
    canActivate: [AuthGuard]
  },
  // ... otras rutas ...
];
