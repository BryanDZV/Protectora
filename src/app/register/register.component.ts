import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../servicios/auth.service.service';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from '../shared/atoms/form-errors/form-errors.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormErrorsComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthServiceService);
  showToast = false;
  toastMessage = '';

  show = false;

  contactForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  togglePassword(): void {
    this.show = !this.show;
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.showSuccess('Formulario inválido');
      return;
    }

    this.authService.register(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.showSuccess('Usuario registrado correctamente');
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 1900); // un poquito de delay para que se vea el mensaje
      },
      error: () => {
        this.showSuccess('Error al registrar el usuario');
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
