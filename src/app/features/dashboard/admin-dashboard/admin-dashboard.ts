import { Component } from '@angular/core';

import { Distribution, MOCK_ADMIN_METRICS } from '../../../core/mock/mock-data';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <section class="ts-page">
      <h1 class="ts-page__title">Dashboard global</h1>
      <p class="ts-page__subtitle">Visión general de la operación de soporte.</p>

      <div class="ts-grid">
        <article class="ts-card">
          <p class="ts-card__label">Total tickets</p>
          <p class="ts-card__value">{{ metrics.totalTickets }}</p>
        </article>
        <article class="ts-card">
          <p class="ts-card__label">Usuarios activos</p>
          <p class="ts-card__value">{{ metrics.activeUsers }}</p>
        </article>
        <article class="ts-card">
          <p class="ts-card__label">Abiertos</p>
          <p class="ts-card__value">{{ metrics.openTickets }}</p>
          <p class="ts-card__hint">Pendientes + en proceso</p>
        </article>
        <article class="ts-card">
          <p class="ts-card__label">Resueltos</p>
          <p class="ts-card__value">{{ metrics.resolvedTickets }}</p>
        </article>
      </div>

      <div class="ts-section">
        <h2 class="ts-section__title">Distribución por categoría</h2>
        @for (item of byCategory; track item.label) {
          <div class="ts-bar">
            <span>{{ item.label }}</span>
            <span class="ts-bar__track">
              <span class="ts-bar__fill" [style.width.%]="percent(item.count)"></span>
            </span>
            <span>{{ item.count }}</span>
          </div>
        }
      </div>

      <div class="ts-section">
        <h2 class="ts-section__title">Distribución por prioridad</h2>
        @for (item of byPriority; track item.label) {
          <div class="ts-bar">
            <span class="ts-badge ts-badge--{{ item.label.toLowerCase() }}">{{ item.label }}</span>
            <span class="ts-bar__track">
              <span class="ts-bar__fill" [style.width.%]="percent(item.count)"></span>
            </span>
            <span>{{ item.count }}</span>
          </div>
        }
      </div>
    </section>
  `,
})
export class AdminDashboard {
  protected readonly metrics = MOCK_ADMIN_METRICS;
  protected readonly byCategory = MOCK_ADMIN_METRICS.byCategory;
  protected readonly byPriority = MOCK_ADMIN_METRICS.byPriority;

  protected percent(count: number): number {
    const max = Math.max(...this.byCategory.concat(this.byPriority as Distribution[]).map((d) => d.count), 1);
    return Math.round((count / max) * 100);
  }
}
