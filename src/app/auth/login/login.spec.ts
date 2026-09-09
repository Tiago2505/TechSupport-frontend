import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { Login } from './login';
import { environment } from '../../../environments/environment';
import { AUTH_TOKEN_KEY } from '../../core/constants/storage-keys';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call the API when the form is invalid', () => {
    component.onSubmit();
    httpMock.expectNone(`${environment.apiUrl}/auth/login`);
    expect(component.form.touched).toBeTrue();
  });

  it('should store the token and redirect to /dashboard on success', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.form.setValue({ email: 'ada@example.com', password: 'secret1' });

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({
      access_token: 'jwt-token',
      user: { id: '1', fullName: 'Ada', email: 'ada@example.com', role: 'USER' },
    });

    expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe('jwt-token');
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show a readable error message on invalid credentials (401)', () => {
    component.form.setValue({ email: 'ada@example.com', password: 'secret1' });

    component.onSubmit();

    httpMock
      .expectOne(`${environment.apiUrl}/auth/login`)
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(component.errorMessage()).toBe('Correo o contraseña incorrectos.');
    expect(component.submitting()).toBeFalse();
  });
});
