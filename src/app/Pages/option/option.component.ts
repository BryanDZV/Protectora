import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { AuthServiceService } from '../../servicios/auth.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
})
export class OptionComponent {
  // Injectamos el servicio de autenticación para pasar la información de que estmaos logados y habilitar el renderizado condicional
  authService = inject(AuthServiceService);
  router = inject(Router);

  logout(): void {
    console.log('logout');
    localStorage.setItem('token', '');
    this.authService.currentUserSig.set(null);
    this.router.navigateByUrl('/login');
  }
}
