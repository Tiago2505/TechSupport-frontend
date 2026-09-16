import { Routes } from '@angular/router';

import { adminGuard } from '@core/guards';

export const AuditLogRoutes: Routes = [
  {
    path: '',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/audit-Log-management/audit-Log-management').then((c) => c.AuditLogManagement),
  },
];
