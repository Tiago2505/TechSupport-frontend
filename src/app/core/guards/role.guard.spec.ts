import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

describe('roleGuard', () => {
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  const run = (roles: UserRole[]) =>
    TestBed.runInInjectionContext(() =>
      roleGuard(
        { data: { roles } } as unknown as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

  it('allows activation when the current role is listed', () => {
    auth.setMockUser('ADMIN');
    expect(run(['ADMIN', 'TECHNICIAN'])).toBeTrue();
  });

  it('redirects to /dashboard when the role is not allowed', () => {
    auth.setMockUser('USER');
    const result = run(['ADMIN']);
    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/dashboard');
  });

  it('redirects to /login when there is no session', () => {
    const result = run(['ADMIN']);
    expect((result as UrlTree).toString()).toBe('/login');
  });
});
