import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../servicios/auth.service.service';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthServiceService);
  showToast = false;
  toastMessage = '';
  isSubmitting = false;

  show = false;

  private readonly passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/;

  contactForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern),
      ],
    ],
  });

  togglePassword(): void {
    this.show = !this.show;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.showSuccess('Formulario inválido');
      return;
    }

    this.isSubmitting = true;
    this.authService.register(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.showSuccess('Usuario registrado correctamente');
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 1900); // un poquito de delay para que se vea el mensaje
        this.isSubmitting = false;
      },
      error: (error) => {
        const backendMessage =
          error?.error?.message ||
          error?.error?.error ||
          'Error al registrar el usuario';
        this.showSuccess(backendMessage);
        this.isSubmitting = false;
      },
    });
  }

  volver(): void {
    this.router.navigate(['/login']);
  }

  showSuccess(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2000); // 2 segundos
  }
}
