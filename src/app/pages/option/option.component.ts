import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthServiceService } from '../../servicios/auth.service.service';

@Component({
  selector: 'app-option',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
})
export class OptionComponent {
  readonly authService = inject(AuthServiceService);
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
    this.authService.clearFavorites().subscribe();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: () => this.router.navigateByUrl('/login'),
    });
  }
}
