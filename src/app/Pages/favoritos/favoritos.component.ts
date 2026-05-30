import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../servicios/api.service';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss',
})
export class FavoritosComponent {
  private readonly apiService = inject(ApiService);

  // Signal de solo lectura desde el servicio
  animalesFavoritos = this.apiService.obtenerAnimalesFavoritos();

  // Computed para mostrar la cantidad sin recalcular manualmente
  totalFavoritos = computed(() => this.animalesFavoritos().length);
}
