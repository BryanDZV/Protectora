import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../servicios/api.service';
import { AuthServiceService } from '../../servicios/auth.service.service';
import { Animal } from '../../types/animal.types';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, TranslatePipe],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss',
})
export class FavoritosComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthServiceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  readonly animalesFavoritos = signal<Animal[]>([]);
  readonly totalFavoritos = computed(() => this.animalesFavoritos().length);

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  private cargarFavoritos(): void {
    const favPets = this.authService.getCurrentUser()?.favPets ?? [];

    if (favPets.length === 0) {
      this.animalesFavoritos.set([]);
      return;
    }

    forkJoin(favPets.map((id) => this.apiService.getAnimalById(id)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (animales) => this.animalesFavoritos.set(animales),
        error: () => this.animalesFavoritos.set([]),
      });
  }

  quitarFavorito(animal: Animal): void {
    this.authService.toggleFavorite(animal.id).subscribe(() => {
      this.animalesFavoritos.update((lista) =>
        lista.filter((item) => item.id !== animal.id),
      );
    });
  }

  limpiarFavoritos(): void {
    if (!confirm(this.translate.instant('FAVORITES.CONFIRM_CLEAR'))) {
      return;
    }

    this.authService.clearFavorites().subscribe(() => {
      this.animalesFavoritos.set([]);
    });
  }
}
