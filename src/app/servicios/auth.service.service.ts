import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Asegúrate de tener la ruta correcta
import { User } from './../interface/user';
import { WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private apiUrl = environment.apiUrl; // Utiliza la URL base del entorno
  currentUserSig: WritableSignal<User | null | undefined> = signal<
    User | null | undefined
  >(undefined);

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(user: { email: string; password: string }) {
    return this.http.post<{ user: User }>(`${this.apiUrl}/user/login`, {
      user,
    });
  }

  // Método para establecer el usuario actual
  setCurrentUser(user: User): void {
    this.currentUserSig.set(user);
  }

  // Método para eliminar el usuario actual
  clearCurrentUser(): void {
    this.currentUserSig.set(null);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return (
      this.currentUserSig() !== null && this.currentUserSig() !== undefined
    );
  }
}
