import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/portada/portada.component').then(m => m.PortadaComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'places', loadComponent: () => import('./pages/places/places.component').then(m => m.PlacesComponent) },
  { path: 'places/:id', loadComponent: () => import('./pages/place-detail/place-detail.component').then(m => m.PlaceDetailComponent) },
  { path: 'perfil', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  {
    path: 'emergencias',
    loadComponent: () => import('./pages/emergencias/emergencias.component').then(m => m.EmergenciasComponent)
  },
  {
    path: 'reportar-incidencia',
    loadComponent: () => import('./pages/reportar-incidencia/reportar-incidencia.component').then(m => m.ReportarIncidenciaComponent)
  },
  {
    path: 'eventos-noticias',
    loadComponent: () => import('./pages/eventos-noticias/eventos-noticias.component').then(m => m.EventosNoticiasComponent)
  },
  {
    path: 'cultura-gastronomia',
    loadComponent: () => import('./pages/cultura-gastronomia/cultura-gastronomia.component').then(m => m.CulturaGastronomiaComponent)
  },
  {
    path: 'mapa-interactivo',
    loadComponent: () => import('./pages/mapa-interactivo/mapa-interactivo.component').then(m => m.MapaInteractivoComponent)
  },
  // ... otras rutas ...
];
