import { Routes } from '@angular/router';

import { technicianGuard } from '@core/guards';

import { TicketsLayout } from './pages/tickets-layout/tickets-layout';

export const TicketsRoutes: Routes = [
  {
    path: '',
    component: TicketsLayout,

    children: [
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/create-ticket/create-ticket').then((c) => c.CreateTicket),
      },

      {
        path: 'my-tickets',
        loadComponent: () => import('./pages/my-tickets/my-tickets').then((c) => c.MyTickets),
      },

      {
        path: 'my-tickets/:id',
        loadComponent: () =>
          import('./pages/ticket-detail/ticket-detail').then((c) => c.TicketDetail),
      },

      {
        path: 'technician-tickets',
        canActivate: [technicianGuard],
        loadComponent: () =>
          import('./pages/technician-tickets/technician-tickets').then((c) => c.TechnicianTickets),
      },

      {
        path: 'update/:id',
        loadComponent: () =>
          import('./pages/update-ticket/update-ticket').then((c) => c.UpdateTicket),
      },

      {
        path: '**',
        redirectTo: 'my-tickets',
      },
    ],
  },
];
