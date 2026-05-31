import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../servicios/api.service';
import { AuthServiceService } from '../../servicios/auth.service.service';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
})
export class OptionComponent {
  readonly authService = inject(AuthServiceService);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  readonly showHelp = signal(true);
  readonly showConfig = signal(false);

  toggleHelp(): void {
    this.showHelp.update((value) => !value);
  }

  toggleConfig(): void {
    this.showConfig.update((value) => !value);
  }

  clearLocalFavorites(): void {
    this.apiService.limpiarFavoritos();
  }

  logout(): void {
    this.authService.clearCurrentUser();
    this.router.navigateByUrl('/login');
  }
}
