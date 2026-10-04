import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthServiceService } from '../../servicios/auth.service.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfileComponent {
  authService = inject(AuthServiceService);
  private router = inject(Router);

  // Simula el estado del interruptor de notificaciones
  notificacionesActivas = true;

  toggleNotificaciones(): void {
    this.notificacionesActivas = !this.notificacionesActivas;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
