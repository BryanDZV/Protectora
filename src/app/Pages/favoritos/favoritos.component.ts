import { Component,} from '@angular/core';
import Animal from '../../../../animal.interface';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../servicios/api.service';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.scss'
})
export class FavoritosComponent {
  animalesFavoritos: Animal[] = [];

  constructor(private apiService: ApiService) {
    this.animalesFavoritos = this.apiService.obtenerAnimalesFavoritos();
  }
}

