import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../servicios/api.service';
import { Animal } from '../../types/animal.types';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly animalesDestacados = signal<Animal[]>([]);

  ngOnInit(): void {
    // Elegimos una página aleatoria para que los destacados cambien en cada visita.
    this.apiService
      .getAnimalesPage(1, 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (first) => {
          const maxPage = Math.min(first.pagination.totalPages, 100) || 1;
          const randomPage = Math.floor(Math.random() * maxPage) + 1;

          this.apiService
            .getAnimalesPage(randomPage, 12)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (res) => {
                const destacados = [...res.data]
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3);
                this.animalesDestacados.set(destacados);
                this.loading.set(false);
              },
              error: () => {
                this.error.set(this.translate.instant('HOME.ERROR'));
                this.loading.set(false);
              },
            });
        },
        error: () => {
          this.error.set(this.translate.instant('HOME.ERROR'));
          this.loading.set(false);
        },
      });
  }

  verDetalle(animal: Animal): void {
    this.router.navigate(['/home/galeria', animal.id]);
  }

  iniciarAdopcion(animal: Animal): void {
    localStorage.setItem('selectedAnimalId', animal.id);
    this.router.navigate(['/home/adopcion', animal.id]);
  }
}
