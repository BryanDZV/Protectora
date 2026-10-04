import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
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
    TranslatePipe,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  readonly fb = inject(FormBuilder);
  readonly router = inject(Router);
  readonly authService = inject(AuthServiceService);
  private readonly translate = inject(TranslateService);

  showToast = false;
  toastMessage = '';
  toastIsError = false;
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
      this.displayToast(this.translate.instant('REGISTER.FORM_INVALID'), true);
      return;
    }

    this.isSubmitting = true;
    this.authService.register(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.displayToast(this.translate.instant('REGISTER.SUCCESS'));
        setTimeout(() => {
          // El registro ya abre sesión (cookie), así que vamos al home.
          this.router.navigateByUrl('/home');
        }, 1900); // un poquito de delay para que se vea el mensaje
        this.isSubmitting = false;
      },
      error: (error) => {
        const backendMessage =
          error?.error?.message ||
          error?.error?.error ||
          this.translate.instant('REGISTER.ERROR_GENERIC');
        this.displayToast(backendMessage, true);
        this.isSubmitting = false;
      },
    });
  }

  volver(): void {
    this.router.navigate(['/login']);
  }

  private displayToast(message: string, isError = false): void {
    this.toastMessage = message;
    this.toastIsError = isError;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2000); // 2 segundos
  }
}
