import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { AuthServiceService } from '../../servicios/auth.service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, NavBarComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  // Injectamos el servicio de autenticación para pasar la información de que estmaos logados y habilitar el renderizado condicional
  authService = inject(AuthServiceService);
}
