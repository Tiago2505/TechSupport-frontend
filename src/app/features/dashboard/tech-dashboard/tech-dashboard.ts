import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TicketWorkflowService } from '../../../core/services/ticket-workflow.service';

@Component({
  selector: 'app-tech-dashboard',
  imports: [DatePipe, RouterLink],
  template: `
    <section class="ts-page">
      <h1 class="ts-page__title">Cola de atención</h1>
      <p class="ts-page__subtitle">Los tickets pendientes se atienden por orden de llegada (FIFO).</p>

      <div class="ts-grid">
        <article class="ts-card">
          <p class="ts-card__label">En cola</p>
          <p class="ts-card__value">{{ queue().length }}</p>
          <p class="ts-card__hint">Pendientes de asignación</p>
        </article>
        <article class="ts-card">
          <p class="ts-card__label">En proceso</p>
          <p class="ts-card__value">{{ inProgress().length }}</p>
          <p class="ts-card__hint">Gestiones activas</p>
        </article>
        <article class="ts-card">
          <p class="ts-card__label">Más antiguo en cola</p>
          <p class="ts-card__value">
            {{ queue().length ? (queue()[0].createdAt | date: 'shortTime') : '—' }}
          </p>
          <p class="ts-card__hint">{{ queue().length ? queue()[0].id : 'Cola vacía' }}</p>
        </article>
      </div>

      <div class="ts-section">
        <div class="tech-dash__head">
          <h2 class="ts-section__title">Cola FIFO — pendientes por llegada</h2>
          <a class="ts-btn-primary" routerLink="/dashboard/queue">Ir a la cola</a>
        </div>
        <div class="ts-table__scroll">
          <table class="ts-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Asunto</th>
                <th>Solicitante</th>
                <th>Prioridad</th>
                <th>Llegada</th>
              </tr>
            </thead>
            <tbody>
              @for (ticket of queue(); track ticket.id; let i = $index) {
                <tr>
                  <td>{{ i + 1 }}</td>
                  <td>{{ ticket.id }}</td>
                  <td>{{ ticket.subject }}</td>
                  <td>{{ ticket.requester }}</td>
                  <td><span class="ts-badge ts-badge--{{ ticket.priority.toLowerCase() }}">{{ ticket.priority }}</span></td>
                  <td>{{ ticket.createdAt | date: 'short' }}</td>
                </tr>
              } @empty {
                <tr><td colspan="6">No hay tickets pendientes.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="ts-section">
        <h2 class="ts-section__title">Tickets en proceso</h2>
        <div class="ts-table__scroll">
          <table class="ts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Asunto</th>
                <th>Solicitante</th>
                <th>Asignado a</th>
                <th>Prioridad</th>
              </tr>
            </thead>
            <tbody>
              @for (ticket of inProgress(); track ticket.id) {
                <tr>
                  <td>{{ ticket.id }}</td>
                  <td>{{ ticket.subject }}</td>
                  <td>{{ ticket.requester }}</td>
                  <td>{{ ticket.assignee }}</td>
                  <td><span class="ts-badge ts-badge--{{ ticket.priority.toLowerCase() }}">{{ ticket.priority }}</span></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `,
  styles: `
    .tech-dash__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .tech-dash__head .ts-section__title {
      margin-bottom: 0;
    }
  `,
})
export class TechDashboard {
  private readonly workflow = inject(TicketWorkflowService);

  protected readonly queue = this.workflow.queue;
  protected readonly inProgress = computed(() =>
    this.workflow.tickets().filter((ticket) => ticket.status === 'EN_PROCESO'),
  );
}
