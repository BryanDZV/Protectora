import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormErrorsComponent } from '../form-errors/form-errors.component';
import { AuthServiceService } from '../servicios/auth.service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormErrorsComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthServiceService);

  contactForm: FormGroup = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  show = false; // control moderno para mostrar/ocultar contraseña

  togglePassword(): void {
    this.show = !this.show;
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;

    this.authService.login(this.contactForm.getRawValue()).subscribe((res) => {
      localStorage.setItem('token', res.user.token);
      this.authService.currentUserSig.set(res.user);
      this.router.navigateByUrl('/home');
    });
  }
  volver(): void {
    this.router.navigate(['/eleccion']);
  }
}
