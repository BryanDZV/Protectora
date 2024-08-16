import { UserComponent } from './user/user.component';
import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortadaComponent } from './portada/portada.component';
import { Slide1Component } from './slide1/slide1.component';
import { Slide2Component } from './slide2/slide2.component';
import { Slide3Component } from './slide3/slide3.component';
import { LoginComponent } from './login/login.component';
import { EleccionComponent } from './eleccion/eleccion.component';
import { HomeComponent } from './home/home.component';
import { GaleriaComponent } from './Pages/galeria/galeria.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { OptionComponent } from './Pages/option/option.component';
import { DetalleComponent } from './Pages/galeriaDetalle/detalle.component';
import { RegisterComponent } from './register/register.component';

import { AdopcionEstadoComponent } from './Pages/adopcion-estado/adopcion-estado.component';
import { AdopcionDetalleComponent } from './Pages/adopcion-detalle/adopcion-detalle.component';

import { FormAdComponent } from './Pages/form-ad/form-ad.component';
import { FavoritosComponent } from './Pages/favoritos/favoritos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'portada', pathMatch: 'full' },
  { path: 'slide1', component: Slide1Component },
  { path: 'slide2', component: Slide2Component },
  { path: 'slide3', component: Slide3Component },
  { path: 'login', component: LoginComponent },
  { path: 'eleccion', component: EleccionComponent },
  { path: 'portada', component: PortadaComponent },
  { path: 'home', component: HomeComponent },
  { path: 'perfil', component: ProfileComponent },
  { path: 'opciones', component: OptionComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'detalle', component: DetalleComponent },
  { path: 'gallery/:id', component: DetalleComponent },
  { path: 'gallery', component: GaleriaComponent },
  { path: 'formAd', component: FormAdComponent },

  { path: 'user', component: UserComponent },

  { path: 'adopcion/:id', component: AdopcionDetalleComponent },

  { path: 'adopcion', component: AdopcionEstadoComponent },
  { path: 'adopciondetalle', component: AdopcionDetalleComponent },

  { path: 'favoritos', component: FavoritosComponent },
];

export class AppRoutingModule {}
