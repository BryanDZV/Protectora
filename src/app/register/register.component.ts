import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthServiceService } from '../servicios/auth.service.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { User } from '../interface/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  showToast = false;
  toastMessage = '';

  show = false;
  private apiUrl = environment.apiUrl;

  contactForm = this.fb.group({
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

    this.http
      .post<{ user: User }>(`${this.apiUrl}/user/register/`, {
        user: this.contactForm.getRawValue(),
      })
      .subscribe({
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
  showSuccess(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2000); // 2 segundos
  }
}
