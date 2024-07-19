import { User } from './../interface/user';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  currentUserSig = signal<User | undefined | null>(undefined);

  constructor() {}
}
