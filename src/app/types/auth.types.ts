import { User } from './user.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SessionResponse {
  user: User;
}