import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Dashboard } from './dashboard';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let auth: AuthService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(Dashboard);
  });

  afterEach(() => localStorage.clear());

  const render = (role: UserRole, selector: string) => {
    auth.setMockUser(role);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector(selector);
  };

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the user dashboard for USER', () => {
    expect(render('USER', 'app-user-dashboard')).not.toBeNull();
  });

  it('renders the tech dashboard for TECHNICIAN', () => {
    expect(render('TECHNICIAN', 'app-tech-dashboard')).not.toBeNull();
  });

  it('renders the admin dashboard for ADMIN', () => {
    expect(render('ADMIN', 'app-admin-dashboard')).not.toBeNull();
  });
});
