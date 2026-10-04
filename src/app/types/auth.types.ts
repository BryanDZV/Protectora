import { User } from './user.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

// El backend ya no devuelve el token: viaja en una cookie httpOnly.
export interface AuthResponse {
  user: User;
}

export interface RegisterUserPayload extends LoginCredentials {
  name: string;
}

export type SessionResponse = User;
