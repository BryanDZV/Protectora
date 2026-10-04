import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../types/user.types';
import {
  AuthResponse,
  LoginCredentials,
  RegisterUserPayload,
  SessionResponse,
} from '../types/auth.types';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private readonly apiUrl = environment.apiUrl;

  // undefined = cargando, null = invitado, User = autenticado
  currentUserSig: WritableSignal<User | null | undefined> = signal<
    User | null | undefined
  >(undefined);

  constructor(private readonly http: HttpClient) {}

  // ================================
  // LOGIN  (el JWT llega en cookie httpOnly)
  // ================================
  login(user: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/user/login`, { user })
      .pipe(tap((response) => this.currentUserSig.set(response.user)));
  }

  // ================================
  // REGISTER  (registra y abre sesión)
  // ================================
  register(user: RegisterUserPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/user/register`, { user })
      .pipe(tap((response) => this.currentUserSig.set(response.user)));
  }

  // ================================
  // RESTAURAR SESIÓN DESDE LA COOKIE
  // ================================
  loadCurrentUser(): void {
    this.http
      .post<SessionResponse>(`${this.apiUrl}/user/checksession`, {})
      .subscribe({
        next: (user) => this.currentUserSig.set(user),
        error: () => this.currentUserSig.set(null),
      });
  }

  // ================================
  // LOGOUT (borra la cookie en el backend)
  // ================================
  logout(): Observable<unknown> {
    return this.http
      .post(`${this.apiUrl}/user/logout`, {})
      .pipe(finalize(() => this.clearCurrentUser()));
  }

  // ================================
  // FAVORITOS (persistidos en el backend)
  // ================================
  toggleFavorite(animalId: string): Observable<User> {
    const current = this.currentUserSig()?.favPets ?? [];
    const favPets = current.includes(animalId)
      ? current.filter((id) => id !== animalId)
      : [...current, animalId];

    return this.http
      .post<User>(`${this.apiUrl}/user/addfav`, { favPets })
      .pipe(tap((user) => this.currentUserSig.set(user)));
  }

  clearFavorites(): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/user/addfav`, { favPets: [] })
      .pipe(tap((user) => this.currentUserSig.set(user)));
  }

  setCurrentUser(user: User): void {
    this.currentUserSig.set(user);
  }

  clearCurrentUser(): void {
    this.currentUserSig.set(null);
  }

  getCurrentUser(): User | null | undefined {
    return this.currentUserSig();
  }

  isAuthenticated(): boolean {
    const user = this.currentUserSig();
    return user !== null && user !== undefined;
  }
}
