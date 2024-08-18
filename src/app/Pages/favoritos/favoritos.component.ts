import { Component } from '@angular/core';
import Animal from '../../../../animal.interface';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../servicios/api.service';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { AdopcionEstadoComponent } from '../adopcion-estado/adopcion-estado.component';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink, NavBarComponent, AdopcionEstadoComponent],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss',
})
export class FavoritosComponent {
  animalesFavoritos: Animal[] = [];

  constructor(private apiService: ApiService) {
    this.animalesFavoritos = this.apiService.obtenerAnimalesFavoritos();
  }
}
