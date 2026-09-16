import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { inject } from '@angular/core';

import { EMPTY, catchError } from 'rxjs';

import { NavigationService } from '@shared/services/navigation.service';
import { StorageService } from '@shared/services/storage.service';
import { AuthService } from '@features/auth/services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const storageService = inject(StorageService);
  const navigationService = inject(NavigationService);
  const authService = inject(AuthService);

  const token =
    storageService.getItemFromLocalStorage('token') ??
    storageService.getItemFromSessionStorage('token');

  // Rutas públicas
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/forgot-password') ||
    req.url.includes('/auth/verify-code') ||
    req.url.includes('/auth/reset-password')
  ) {
    return next(req);
  }

  // No hay token
  if (!token) {
    navigationService.goToLogin();
    return EMPTY;
  }

  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(newReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
        navigationService.goToLogin();
        return EMPTY;
      }

      throw error;
    }),
  );
}
