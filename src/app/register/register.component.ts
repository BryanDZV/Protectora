import { AuthServiceService } from './../servicios/auth.service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../interface/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'; // Asegúrate de tener la ruta correcta

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  isSubmitted: boolean = false;
  contactForm!: FormGroup;
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthServiceService);
  router = inject(Router);
  private apiUrl = environment.apiUrl; // Usa la URL base del entorno

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  showPassword(): void {
    const passwordInput = document.getElementById(
      'passwordInput'
    ) as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.contactForm.invalid) {
      alert('Formulario inválido');
      return;
    }

    this.http
      .post<{ user: User }>(`${this.apiUrl}/user/register/`, {
        user: this.contactForm.getRawValue(),
      })
      .subscribe({
        next: (response) => {
          console.log('response', response);
          this.router.navigateByUrl('/login');
          alert('Usuario registrado correctamente');
        },
        error: (error) => {
          console.error('Error en el registro', error);
          alert('Error al registrar el usuario');
        },
      });
  }
}
