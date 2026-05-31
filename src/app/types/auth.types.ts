import { User } from './user.types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

export interface RegisterUserPayload extends LoginCredentials {
  name: string;
}

export interface SessionResponse {
  user: User;
}
