import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../interface/user';

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
  login(user: { email: string; password: string }) {
    return this.http.post<{ user: User; token: string }>(
      `${this.apiUrl}/user/login`,
      { user }
    );
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
      .post<{ user: User }>(`${this.apiUrl}/user/checksession`, {})
      .subscribe({
        next: (response) => {
          this.currentUserSig.set(response.user);
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

  // ================================
  // COMPROBAR SI ESTÁ AUTENTICADO
  // ================================
  isAuthenticated(): boolean {
    const user = this.currentUserSig();
    return user !== null && user !== undefined;
  }
}
