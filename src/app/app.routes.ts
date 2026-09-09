import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { PlaceholderView } from './features/placeholder/placeholder-view';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'dashboard',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },

      // Cliente (USER)
      { path: 'tickets', component: PlaceholderView, canActivate: [roleGuard], data: { title: 'Mis Tickets', roles: ['USER'] } },
      { path: 'tickets/new', component: PlaceholderView, canActivate: [roleGuard], data: { title: 'Crear Ticket', roles: ['USER'] } },

      // Compartido Cliente + Técnico
      { path: 'assistant', component: PlaceholderView, canActivate: [roleGuard], data: { title: 'Asistente IA', roles: ['USER', 'TECHNICIAN'] } },

      // Técnico (TECHNICIAN)
      { path: 'queue', component: PlaceholderView, canActivate: [roleGuard], data: { title: 'Cola FIFO (Pendientes)', roles: ['TECHNICIAN'] } },
      { path: 'my-work', component: PlaceholderView, canActivate: [roleGuard], data: { title: 'Mis Gestiones', roles: ['TECHNICIAN'] } },

      // Administrador (ADMIN)
      { path: 'users', component: PlaceholderView, canActivate: [roleGuard], data: { title: 'Usuarios', roles: ['ADMIN'] } },
      { path: 'categories', component: PlaceholderView, canActivate: [roleGuard], data: { title: 'Categorías', roles: ['ADMIN'] } },
      { path: 'stats', component: PlaceholderView, canActivate: [roleGuard], data: { title: 'Estadísticas', roles: ['ADMIN'] } },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
