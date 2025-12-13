import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from './servicios/auth.service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TeamProyecto_Final';

  authService = inject(AuthServiceService);

  ngOnInit(): void {
    // Recuperar usuario desde token al arrancar la app
    this.authService.loadUserFromToken();
  }
}
