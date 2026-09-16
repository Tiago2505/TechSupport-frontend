import { Routes } from '@angular/router';
import { authGuard } from '@core/guards';


export const AuthRoutes: Routes = [
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/login/login').then((c) => c.Login),
  },

  {
    path: 'register',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/register/register').then((c) => c.Register),
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password').then((c) => c.ForgotPassword),
  },

  {
    path: 'verify-code',
    loadComponent: () =>
      import('./pages/verify-password-reset-code/verify-password-reset-code').then(
        (c) => c.VerifyPasswordResetCode,
      ),
  },

  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password').then((c) => c.ResetPassword),
  },

  {
    path: 'change-password',
    loadComponent: () =>
      import('./pages/change-password/change-password').then((c) => c.ChangePassword),
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];
