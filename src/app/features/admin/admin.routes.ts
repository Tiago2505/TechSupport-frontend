import { Routes } from '@angular/router';

import { adminGuard } from '@core/guards';

export const AdminRoutes: Routes = [
  {
    path: 'dashboard',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then((c) => c.Dashboard),
  },
];
