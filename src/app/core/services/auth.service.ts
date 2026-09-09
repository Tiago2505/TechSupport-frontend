import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/storage-keys';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  UserRole,
} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly _currentUser = signal<User | null>(this.readStoredUser());

  /** Authenticated user, or `null` when there is no active session. */
  readonly currentUser = this._currentUser.asReadonly();

  /** Role of the authenticated user (`USER`, `TECHNICIAN`, `ADMIN`), or `null`. */
  readonly role = computed<UserRole | null>(() => this._currentUser()?.role ?? null);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(tap((response) => this.persistSession(response)));
  }

  register(userData: RegisterData): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    this._currentUser.set(null);
  }

  /**
   * Simulates an active session for the given role without hitting the API.
   * Intended for building and previewing the UI independently of the backend.
   */
  setMockUser(role: UserRole): void {
    const mockUsers: Record<UserRole, User> = {
      USER: { id: 'mock-user', fullName: 'Lucía Fernández', email: 'cliente@techsupport.dev', role: 'USER' },
      TECHNICIAN: { id: 'mock-tech', fullName: 'Diego Ramírez', email: 'tecnico@techsupport.dev', role: 'TECHNICIAN' },
      ADMIN: { id: 'mock-admin', fullName: 'Marta Ochoa', email: 'admin@techsupport.dev', role: 'ADMIN' },
    };

    this.persistSession({ access_token: `mock-token-${role.toLowerCase()}`, user: mockUsers[role] });
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  private persistSession(response: AuthResponse): void {
    localStorage.setItem(AUTH_TOKEN_KEY, response.access_token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
    this._currentUser.set(response.user);
  }

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }
  }
}
