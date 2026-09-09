import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { Register } from './register';
import { environment } from '../../../environments/environment';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let httpMock: HttpTestingController;

  const validForm = {
    fullName: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'secret1',
    confirmPassword: 'secret1',
  };

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
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

  it('should post the account without confirmPassword and redirect to /login on success', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.form.setValue(validForm);

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.body).toEqual({
      fullName: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'secret1',
    });
    req.flush({ id: '1', fullName: 'Juan Pérez', email: 'juan@example.com', role: 'USER' });

    expect(navigateSpy).toHaveBeenCalledWith(['/login'], { queryParams: { registered: 'true' } });
  });

  it('should show an error message when the email is already registered (409)', () => {
    component.form.setValue(validForm);

    component.onSubmit();

    httpMock
      .expectOne(`${environment.apiUrl}/auth/register`)
      .flush({ message: 'Conflict' }, { status: 409, statusText: 'Conflict' });

    expect(component.errorMessage()).toBe('Este correo ya está registrado.');
  });

  it('should show a validation error message on 400', () => {
    component.form.setValue(validForm);

    component.onSubmit();

    httpMock
      .expectOne(`${environment.apiUrl}/auth/register`)
      .flush({ message: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });

    expect(component.errorMessage()).toBe('Revisa los datos ingresados e inténtalo de nuevo.');
  });
});
