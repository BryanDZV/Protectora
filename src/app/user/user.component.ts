import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthServiceService } from '../servicios/auth.service.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private readonly authService = inject(AuthServiceService);

  get user() {
    return this.authService.currentUserSig();
  }
}
