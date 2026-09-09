import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { MainLayout } from './main-layout';
import { AuthService } from '../../core/services/auth.service';

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;
  let auth: AuthService;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the client menu for USER', () => {
    auth.setMockUser('USER');
    const labels = component.menu().map((item) => item.label);
    expect(labels).toContain('Mis Tickets');
    expect(labels).toContain('Crear Ticket');
    expect(labels).toContain('Asistente IA');
    expect(labels).not.toContain('Usuarios');
  });

  it('shows the technician menu for TECHNICIAN', () => {
    auth.setMockUser('TECHNICIAN');
    const labels = component.menu().map((item) => item.label);
    expect(labels).toContain('Cola FIFO (Pendientes)');
    expect(labels).toContain('Mis Gestiones');
  });

  it('shows the admin menu for ADMIN', () => {
    auth.setMockUser('ADMIN');
    const labels = component.menu().map((item) => item.label);
    expect(labels).toEqual(['Dashboard Global', 'Usuarios', 'Categorías', 'Estadísticas']);
  });

  it('switches the mock session and navigates on role change', () => {
    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
    component.onRoleChange('ADMIN');
    expect(auth.currentUser()?.role).toBe('ADMIN');
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('clears the session and returns to /login on logout', () => {
    const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');
    auth.setMockUser('USER');

    component.logout();

    expect(auth.isAuthenticated()).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
