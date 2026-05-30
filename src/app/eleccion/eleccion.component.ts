import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eleccion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eleccion.component.html',
  styleUrls: ['./eleccion.component.scss'],
})
export class EleccionComponent {
  constructor(private router: Router) {}

  login(): void {
    this.router.navigate(['/login']);
  }

  refugio(): void {
    // Antes navegabas a '/', que no es una ruta válida.
    // Lo correcto sería llevar al registro de asociaciones o algo similar.
    this.router.navigate(['/register']);
  }

  registrarseLuego(): void {
    // Cambia esta ruta según tu proyecto real
    this.router.navigate(['/home']);
  }
}
