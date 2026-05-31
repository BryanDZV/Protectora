import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Material UI (Átomos)
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Lógica y Tipos (SoC)
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
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  // Inyección de dependencias recomendada para Standalone Components (Angular 14+)
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthServiceService);
  private readonly router = inject(Router);

  // UI State usando Signals (Mejora de rendimiento sobre ChangeDetection tradicional)
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);
  public hidePassword = signal<boolean>(true);

  // Reactive Forms (Manejo estructurado y granular de estados y errores)
  public loginForm: FormGroup = this.fb.group({
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
    if (control?.hasError('required')) return 'El correo es obligatorio';
    if (control?.hasError('email')) return 'Formato de correo inválido';
    return '';
  }

  get passwordError(): string {
    const control = this.loginForm.get('password');
    if (control?.hasError('required')) return 'La contraseña es obligatoria';
    if (control?.hasError('minlength')) return 'Debe tener al menos 6 caracteres';
    return '';
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials: LoginCredentials = this.loginForm.value;

    // TODO: Ajusta 'login' al método exacto que tengas en AuthServiceService
    // Simulando subscripción a API delegada al servicio externo
    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      },
    });
  }
}
