import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-portada',
  standalone: true,
  imports: [TranslatePipe],
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
