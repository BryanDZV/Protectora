import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../types/user.types';
import {
  AuthResponse,
  LoginCredentials,
  RegisterUserPayload,
  SessionResponse,
} from '../types/auth.types';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private apiUrl = environment.apiUrl;

  // señal del usuario
  currentUserSig: WritableSignal<User | null | undefined> = signal<
    User | null | undefined
  >(undefined);

  constructor(private http: HttpClient) {}

  // ================================
  // LOGIN
  // ================================
  login(user: LoginCredentials) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/user/login`, { user })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.currentUserSig.set(response.user);
        }),
      );
  }

  // ================================
  // REGISTER
  // ================================
  register(user: RegisterUserPayload) {
    return this.http.post<User>(`${this.apiUrl}/user/register`, { user });
  }

  // ================================
  // CARGAR USUARIO DESDE TOKEN
  // ================================
  loadUserFromToken(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.currentUserSig.set(null);
      return;
    }

    this.http
      .post<SessionResponse>(`${this.apiUrl}/user/checksession`, {})
      .subscribe({
        next: (response) => {
          this.currentUserSig.set(response);
        },
        error: () => {
          localStorage.removeItem('token');
          this.currentUserSig.set(null);
        },
      });
  }

  // ================================
  // SET USER
  // ================================
  setCurrentUser(user: User): void {
    this.currentUserSig.set(user);
  }

  // ================================
  // LOGOUT
  // ================================
  clearCurrentUser(): void {
    this.currentUserSig.set(null);
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null | undefined {
    return this.currentUserSig();
  }

  // ================================
  // COMPROBAR SI ESTÁ AUTENTICADO
  // ================================
  isAuthenticated(): boolean {
    const user = this.currentUserSig();
    return user !== null && user !== undefined;
  }
}
