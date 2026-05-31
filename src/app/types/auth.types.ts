import { User } from './user.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterUserPayload extends LoginCredentials {
  name: string;
}

export type SessionResponse = User;
