import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../servicios/api.service';
import { Animal } from '../../types/animal.types';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss',
})
export class FavoritosComponent {
  private readonly apiService = inject(ApiService);

  // Signal de solo lectura desde el servicio
  animalesFavoritos = this.apiService.obtenerAnimalesFavoritos();

  // Computed para mostrar la cantidad sin recalcular manualmente
  totalFavoritos = computed(() => this.animalesFavoritos().length);

  quitarFavorito(animal: Animal): void {
    this.apiService.eliminarAnimalFavorito(animal);
  }

  limpiarFavoritos(): void {
    if (confirm('¿Estás seguro de que deseas vaciar tu lista de favoritos?')) {
      this.apiService.limpiarFavoritos();
    }
  }
}
