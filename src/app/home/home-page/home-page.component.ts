import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../servicios/api.service';
import { Animal } from '../../types/animal.types';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly animalesDestacados = signal<Animal[]>([]);

  ngOnInit(): void {
    this.apiService
      .getAnimales()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (animales) => {
          this.animalesDestacados.set(animales.slice(0, 3));
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se han podido cargar las novedades.');
          this.loading.set(false);
        },
      });
  }

  verDetalle(animal: Animal): void {
    this.router.navigate(['/home/gallery', animal._id]);
  }

  iniciarAdopcion(animal: Animal): void {
    localStorage.setItem('selectedAnimalId', animal._id);
    this.router.navigate(['/home/adopcion', animal._id]);
  }
}
