import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../servicios/auth.service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

@Injectable()
export class LoginController {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthServiceService);

  // Estado reactivo (Signals)
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Formulario de login
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.getRawValue())
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.authService.setCurrentUser(res.user);
          this.router.navigateByUrl('/home');
        },
        error: (err: HttpErrorResponse) => {
          this.handleError(err);
        },
      });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateBack(): void {
    this.router.navigate(['/eleccion']);
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status === 401 || error.status === 400) {
      this.errorMessage.set('Credenciales incorrectas. Verifica tu email y contraseña.');
    } else if (error.status === 0) {
      this.errorMessage.set('No se pudo conectar al servidor. Inténtalo más tarde.');
    } else {
      this.errorMessage.set('Ocurrió un error inesperado al iniciar sesión.');
    }
  }
}
