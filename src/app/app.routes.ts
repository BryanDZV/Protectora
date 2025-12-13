// src/app/app.routes.ts
import { Routes } from '@angular/router';

// Portada / intro / login
import { PortadaComponent } from './portada/portada.component';
import { LoginComponent } from './login/login.component';
import { EleccionComponent } from './eleccion/eleccion.component';
import { RegisterComponent } from './register/register.component';
import { SlidesComponent } from './slides/slides.component';

// Home (nuevo layout) y home real (contenido)
import { HomeLayoutComponent } from './home/home-layout/home-layout.component';
import { HomePageComponent } from './home/home-page/home-page.component';

// Pages dentro de home
import { GaleriaComponent } from './Pages/galeria/galeria.component';
import { DetalleComponent } from './Pages/galeriaDetalle/detalle.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { OptionComponent } from './Pages/option/option.component';
import { FormAdComponent } from './Pages/form-ad/form-ad.component';
import { AdopcionDetalleComponent } from './Pages/adopcion-detalle/adopcion-detalle.component';
import { AdopcionEstadoComponent } from './Pages/adopcion-estado/adopcion-estado.component';
import { FavoritosComponent } from './Pages/favoritos/favoritos.component';
import { UserComponent } from './user/user.component';
import { authGuard } from './guards/auth.guard';

// ======================
// RUTAS DE LA APLICACIÓN
// ======================
export const routes: Routes = [
  // 🔹 Ruta raíz → portada
  { path: '', redirectTo: 'portada', pathMatch: 'full' },
  { path: 'portada', component: PortadaComponent },

  // 🔹 Slides de introducción
  { path: 'slide/:id', component: SlidesComponent },

  // 🔹 Login / register / elección
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'eleccion', component: EleccionComponent },

  // ================================================
  // RUTA PADRE "HOME" → LAYOUT con router-outlet + navbar
  // ================================================
  {
    path: 'home',
    component: HomeLayoutComponent, // Layout que envuelve todas las páginas internas
    canActivate: [authGuard], // defendemos rutas
    children: [
      // 🔹 Página principal de home (TU home real)
      // Antes este contenido estaba dentro de HomeComponent
      { path: '', component: HomePageComponent },

      // 🔹 Galería
      { path: 'gallery', component: GaleriaComponent },
      { path: 'gallery/:id', component: DetalleComponent },

      // 🔹 Perfil y opciones
      { path: 'profile', component: ProfileComponent },
      { path: 'opciones', component: OptionComponent },

      // 🔹 Formularios, adopción, favoritos
      { path: 'formAd', component: FormAdComponent },
      { path: 'adopcion/:id', component: AdopcionDetalleComponent },
      { path: 'adopcion-estado', component: AdopcionEstadoComponent },
      { path: 'favoritos', component: FavoritosComponent },

      // 🔹 Usuario (si lo usas dentro de home)
      { path: 'user', component: UserComponent },
    ],
  },

  // 🔹 Ruta fallback → vuelve a portada si no existe la ruta
  { path: '**', redirectTo: 'portada' },
];
