import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavBarComponent {
  router = inject(Router);

  onSearch(value: string) {
    const q = (value || '').toString().trim();
    this.router.navigate(['/home/galeria'], { queryParams: { q } });
  }
}
