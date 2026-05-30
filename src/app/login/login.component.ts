import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from '../shared/atoms/form-errors/form-errors.component';
import { ErrorAlertComponent } from '../shared/molecules/error-alert/error-alert.component';
import { LoginController } from './login.controller';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormErrorsComponent, ErrorAlertComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginController]
})
export class LoginComponent {
  controller = inject(LoginController);
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
