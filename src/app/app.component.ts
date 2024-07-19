import { UserComponent } from './user/user.component';
import { FormAdComponent } from './Pages/form-ad/form-ad.component';
import { User } from './interface/user';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GaleriaComponent } from './Pages/galeria/galeria.component';
import { PortadaComponent } from './portada/portada.component';
import { Slide1Component } from './slide1/slide1.component';
import { Slide2Component } from './slide2/slide2.component';
import { Slide3Component } from './slide3/slide3.component';
import { LoginComponent } from './login/login.component';
import { EleccionComponent } from './eleccion/eleccion.component';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DetalleComponent } from './Pages/galeriaDetalle/detalle.component';

import { AuthServiceService } from './servicios/auth.service.service';
import { HttpClient } from '@angular/common/http';

import { AdopcionEstadoComponent } from './Pages/adopcion-estado/adopcion-estado.component';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    GaleriaComponent,
    RouterOutlet,
    CommonModule,
    PortadaComponent,
    Slide1Component,
    Slide2Component,
    Slide3Component,
    LoginComponent,
    EleccionComponent,
    HomeComponent,
    MatDialogModule,
    MatIconModule,
    DetalleComponent,



    AdopcionEstadoComponent,
    MatNativeDateModule,

    FormAdComponent,
    UserComponent,
    AdopcionEstadoComponent

  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'TeamProyecto_Final';

  authService = inject(AuthServiceService);
  http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get<{ user: User }>('https://api.realworld.io/api/user')
      .subscribe({
        next: (response) => {
          console.log('response', response);
          this.authService.currentUserSig.set(response.user);
        },
        error: () => {
          this.authService.currentUserSig.set(null);
        },
      });
  }

  // Llevamos la funcion logout al sitio donde va a estar el boton de logout, que es option component
  // logout(): void {
  //   console.log('logout');
  //   localStorage.setItem('token', '');
  //   this.authService.currentUserSig.set(null);
  // }
}
