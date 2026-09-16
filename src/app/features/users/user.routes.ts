import { Routes } from '@angular/router';

import { adminGuard } from '@core/guards';

export const UserRoutes: Routes = [
  {
    path: 'management',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/user-management/user-management').then((c) => c.UserManagement),
  },

  {
    path: 'update/:id',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/update-users/update-users').then((c) => c.UpdateUsers),
  },
];
