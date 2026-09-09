import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { TechDashboard } from './tech-dashboard/tech-dashboard';
import { UserDashboard } from './user-dashboard/user-dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [UserDashboard, TechDashboard, AdminDashboard],
  template: `
    @switch (auth.role()) {
      @case ('USER') {
        <app-user-dashboard />
      }
      @case ('TECHNICIAN') {
        <app-tech-dashboard />
      }
      @case ('ADMIN') {
        <app-admin-dashboard />
      }
      @default {
        <p class="ts-page">Selecciona un rol para ver el panel.</p>
      }
    }
  `,
})
export class Dashboard {
  protected readonly auth = inject(AuthService);
}
