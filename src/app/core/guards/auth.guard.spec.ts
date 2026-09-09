import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => localStorage.clear());

  const run = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  it('allows activation when authenticated', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'jwt-token');
    expect(run()).toBeTrue();
  });

  it('redirects to /login when not authenticated', () => {
    const result = run();
    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/login');
  });

  it('redirects after a mock session has been cleared', () => {
    TestBed.inject(AuthService).setMockUser('USER');
    expect(run()).toBeTrue();

    TestBed.inject(AuthService).logout();
    expect((run() as UrlTree).toString()).toBe('/login');
  });
});
