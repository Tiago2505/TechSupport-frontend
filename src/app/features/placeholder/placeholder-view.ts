import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Generic "under construction" screen used for secondary menu routes while the
 * real feature screens are built. The title comes from the route's
 * `data: { title: string }`.
 */
@Component({
  selector: 'app-placeholder-view',
  template: `
    <section class="ts-page">
      <h1 class="ts-page__title">{{ title }}</h1>
      <p class="ts-page__subtitle">Sección en construcción.</p>
      <div class="ts-section">
        <p>Esta pantalla se conectará con el backend en una etapa posterior.</p>
      </div>
    </section>
  `,
})
export class PlaceholderView {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = (this.route.snapshot.data['title'] as string | undefined) ?? 'Sección';
}
