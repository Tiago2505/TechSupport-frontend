import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Allows access only when the current user's role is listed in the route's
 * `data: { roles: UserRole[] }`. Falls back to `/dashboard` otherwise.
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = (route.data['roles'] as UserRole[] | undefined) ?? [];
  const role = auth.currentUser()?.role;

  if (role && allowedRoles.includes(role)) {
    return true;
  }

  return router.createUrlTree([auth.isAuthenticated() ? '/dashboard' : '/login']);
};
