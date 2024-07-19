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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  // isSubmitted: boolean = false;
  contactForm!: FormGroup;
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthServiceService);
  router = inject(Router);

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
    // this.isSubmitted = true;
    this.http
      .post<{ user: User }>('http://localhost:5002/user/register/', {
        user: this.contactForm.getRawValue(),
      })
      .subscribe((response) => {
        console.log('response', response);
        this.router.navigateByUrl('/login');
        alert('Usuario registrado correctamente');


      });
  }
}
