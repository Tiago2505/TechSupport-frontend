import { Routes } from '@angular/router';
import { MainLayout } from '@core/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then((c) => c.Home),
      },
      {
        path: 'tickets',
        loadChildren: () =>
          import('./features/tickets/tickets.routes').then((c) => c.TicketsRoutes),
      },
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then((c) => c.AdminRoutes),
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/user.routes').then((c) => c.UserRoutes),
      },
      {
        path: 'audit',
        loadChildren: () => import('./features/auditLogs/audit-logs.routes').then((c) => c.AuditLogRoutes),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((c) => c.AuthRoutes),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
