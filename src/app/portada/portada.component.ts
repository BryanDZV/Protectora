import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-portada',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.scss'],
})
export class PortadaComponent {
  constructor(private router: Router) {}

  irSlide1(): void {
    // Navegación moderna y limpia
    this.router.navigate(['/slide', 1]);

  }
}

