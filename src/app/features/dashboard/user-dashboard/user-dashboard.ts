import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { MOCK_TICKETS, recentTickets, ticketsByStatus } from '../../../core/mock/mock-data';

@Component({
  selector: 'app-user-dashboard',
  imports: [DatePipe],
  template: `
    <section class="ts-page">
      <h1 class="ts-page__title">Hola, {{ auth.currentUser()?.fullName }}</h1>
      <p class="ts-page__subtitle">Este es el estado de tus solicitudes de soporte.</p>

      <div class="ts-grid">
        <article class="ts-card">
          <p class="ts-card__label">Pendientes</p>
          <p class="ts-card__value">{{ pending }}</p>
          <p class="ts-card__hint">En espera de un técnico</p>
        </article>
        <article class="ts-card">
          <p class="ts-card__label">En proceso</p>
          <p class="ts-card__value">{{ inProgress }}</p>
          <p class="ts-card__hint">Un técnico está trabajando en ellas</p>
        </article>
        <article class="ts-card">
          <p class="ts-card__label">Resueltos</p>
          <p class="ts-card__value">{{ resolved }}</p>
          <p class="ts-card__hint">Cerrados en los últimos días</p>
        </article>
      </div>

      <div class="ts-section">
        <h2 class="ts-section__title">Tickets recientes</h2>
        <div class="ts-table__scroll">
          <table class="ts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Asunto</th>
                <th>Categoría</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              @for (ticket of recent; track ticket.id) {
                <tr>
                  <td>{{ ticket.id }}</td>
                  <td>{{ ticket.subject }}</td>
                  <td>{{ ticket.category }}</td>
                  <td><span class="ts-badge ts-badge--{{ ticket.priority.toLowerCase() }}">{{ ticket.priority }}</span></td>
                  <td><span class="ts-badge ts-badge--{{ ticket.status.toLowerCase() }}">{{ ticket.status }}</span></td>
                  <td>{{ ticket.createdAt | date: 'short' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
})
export class UserDashboard {
  protected readonly auth = inject(AuthService);

  protected readonly pending = ticketsByStatus('PENDIENTE').length;
  protected readonly inProgress = ticketsByStatus('EN_PROCESO').length;
  protected readonly resolved = ticketsByStatus('RESUELTO').length;
  protected readonly recent = recentTickets(6, MOCK_TICKETS);
}
