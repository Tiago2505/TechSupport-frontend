import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../constants/storage-keys';
import { AuthResponse } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const authResponse: AuthResponse = {
    access_token: 'jwt-token',
    user: { id: '1', fullName: 'Ada Lovelace', email: 'ada@example.com', role: 'ADMIN' },
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should persist the token and expose the user and role after login', () => {
    service.login({ email: 'ada@example.com', password: 'secret1' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(authResponse);

    expect(service.getToken()).toBe('jwt-token');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUser()?.email).toBe('ada@example.com');
    expect(service.role()).toBe('ADMIN');
    expect(localStorage.getItem(AUTH_USER_KEY)).toContain('ada@example.com');
  });

  it('should clear the session on logout', () => {
    service.login({ email: 'ada@example.com', password: 'secret1' }).subscribe();
    httpMock.expectOne(`${environment.apiUrl}/auth/login`).flush(authResponse);

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(service.role()).toBeNull();
    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
  });

  it('should not persist a session when registering', () => {
    service
      .register({ fullName: 'New User', email: 'new@example.com', password: 'secret1' })
      .subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(authResponse.user);

    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
  });

  it('should open a mock session for the requested role without calling the API', () => {
    service.setMockUser('TECHNICIAN');

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.role()).toBe('TECHNICIAN');
    expect(service.currentUser()?.fullName).toBeTruthy();
    httpMock.expectNone(`${environment.apiUrl}/auth/login`);
  });

  it('should restore the user from localStorage on construction', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'jwt-token');
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authResponse.user));

    const fresh = TestBed.runInInjectionContext(() => new AuthService());

    expect(fresh.currentUser()?.email).toBe('ada@example.com');
    expect(fresh.role()).toBe('ADMIN');
  });
});
