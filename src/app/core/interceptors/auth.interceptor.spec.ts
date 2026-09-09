import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';
import { environment } from '../../../environments/environment';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should attach a Bearer token to API requests when a token is stored', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'jwt-token');

    http.get(`${environment.apiUrl}/tickets`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/tickets`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    req.flush({});
  });

  it('should not attach a header to API requests when there is no token', () => {
    http.get(`${environment.apiUrl}/tickets`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/tickets`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should not attach the token to requests outside the API', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'jwt-token');

    http.get('https://third-party.example.com/data').subscribe();

    const req = httpMock.expectOne('https://third-party.example.com/data');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
