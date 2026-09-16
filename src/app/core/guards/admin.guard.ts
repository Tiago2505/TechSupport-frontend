import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@features/auth/services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getUserFromToken();

  if (!currentUser) {
    return router.createUrlTree(['/auth/login']);
  }

  if (currentUser.role !== 'ADMIN') {
    return router.createUrlTree(['/home']);
  }

  return true;
};
