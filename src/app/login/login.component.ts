import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Material UI (Átomos)
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Lógica y Tipos (SoC)
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthServiceService } from '../servicios/auth.service.service';
import { LoginCredentials } from '../types/auth.types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // Inyección de dependencias recomendada para Standalone Components (Angular 14+)
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthServiceService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  // UI State usando Signals (Mejora de rendimiento sobre ChangeDetection tradicional)
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  public hidePassword = signal<boolean>(true);

  // Reactive Forms (Manejo estructurado y granular de estados y errores)
  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public togglePasswordVisibility(): void {
    this.hidePassword.update((value) => !value);
  }

  // Navegación de regreso
  public goBack(): void {
    this.router.navigate(['/portada']);
  }

  // Getters para manejo granular de mensajes de error de UI (Principio DRY)
  get emailError(): string {
    const control = this.loginForm.get('email');
    if (control?.hasError('required'))
      return this.translate.instant('LOGIN.EMAIL_REQUIRED');
    if (control?.hasError('email'))
      return this.translate.instant('LOGIN.EMAIL_INVALID');
    return '';
  }

  get passwordError(): string {
    const control = this.loginForm.get('password');
    if (control?.hasError('required'))
      return this.translate.instant('LOGIN.PASSWORD_REQUIRED');
    if (control?.hasError('minlength'))
      return this.translate.instant('LOGIN.PASSWORD_MIN');
    return '';
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials: LoginCredentials = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        const message =
          err?.error?.message ||
          err?.error?.error ||
          this.translate.instant('LOGIN.ERROR_GENERIC');
        this.errorMessage.set(message);
      },
    });
  }
}
