// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

// ======================
// RUTAS DE LA APLICACIÓN
// ======================
export const routes: Routes = [
  // 🔹 Ruta raíz → portada
  { path: '', redirectTo: 'portada', pathMatch: 'full' },
  {
    path: 'portada',
    loadComponent: () =>
      import('./portada/portada.component').then((m) => m.PortadaComponent),
  },

  // 🔹 Slides de introducción
  {
    path: 'slide/:id',
    loadComponent: () =>
      import('./slides/slides.component').then((m) => m.SlidesComponent),
  },

  // 🔹 Login / register / elección
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'eleccion',
    loadComponent: () =>
      import('./eleccion/eleccion.component').then((m) => m.EleccionComponent),
  },

  // ================================================
  // RUTA PADRE "HOME" → LAYOUT con router-outlet + navbar
  // ================================================
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home-layout/home-layout.component').then(
        (m) => m.HomeLayoutComponent,
      ),
    canActivate: [authGuard], // defendemos rutas
    children: [
      // 🔹 Página principal de home (TU home real)
      // Antes este contenido estaba dentro de HomeComponent
      {
        path: '',
        loadComponent: () =>
          import('./home/home-page/home-page.component').then(
            (m) => m.HomePageComponent,
          ),
      },

      // 🔹 Galería
      {
        path: 'galeria',
        loadComponent: () =>
          import('./pages/galeria/galeria.component').then(
            (m) => m.GaleriaComponent,
          ),
      },
      {
        path: 'map',
        loadComponent: () =>
          import('./pages/map/map.component').then((m) => m.MapComponent),
      },
      {
        path: 'galeria/:id',
        loadComponent: () =>
          import('./pages/galeriaDetalle/detalle.component').then(
            (m) => m.DetalleComponent,
          ),
      },

      // 🔹 Perfil y opciones
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },
      {
        path: 'opciones',
        loadComponent: () =>
          import('./pages/option/option.component').then(
            (m) => m.OptionComponent,
          ),
      },

      // 🔹 Formularios, adopción, favoritos
      {
        path: 'formAd',
        loadComponent: () =>
          import('./pages/form-ad/form-ad.component').then(
            (m) => m.FormAdComponent,
          ),
      },
      {
        path: 'adopcion/:id',
        loadComponent: () =>
          import('./pages/adopcion-detalle/adopcion-detalle.component').then(
            (m) => m.AdopcionDetalleComponent,
          ),
      },
      {
        path: 'mis-solicitudes',
        loadComponent: () =>
          import('./pages/mis-solicitudes/mis-solicitudes.component').then(
            (m) => m.MisSolicitudesComponent,
          ),
      },
      {
        path: 'favoritos',
        loadComponent: () =>
          import('./pages/favoritos/favoritos.component').then(
            (m) => m.FavoritosComponent,
          ),
      },

      // 🔹 Usuario (si lo usas dentro de home)
      {
        path: 'user',
        loadComponent: () =>
          import('./user/user.component').then((m) => m.UserComponent),
      },
    ],
  },

  // 🔹 Ruta fallback → vuelve a portada si no existe la ruta
  { path: '**', redirectTo: 'portada' },
];
