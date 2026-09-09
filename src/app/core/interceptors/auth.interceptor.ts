import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { AUTH_TOKEN_KEY } from '../constants/storage-keys';

/**
 * Attaches `Authorization: Bearer <token>` to every request targeting the API
 * when a JWT is present in localStorage.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token && req.url.startsWith(environment.apiUrl)) {
    return next(
      req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      }),
    );
  }

  return next(req);
};
