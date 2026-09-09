import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { Ticket, ticketsByRequester } from '../../core/mock/mock-data';

interface Metric {
  readonly label: string;
  readonly value: number;
  readonly hint: string;
  readonly modifier: string;
}

/**
 * Home / User Dashboard (PRD §14). Shows the client a summary of their support
 * requests: four metric cards, the list of tickets they reported and a
 * highlighted call to action to open a new ticket.
 */
@Component({
  selector: 'app-home',
  imports: [DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly auth = inject(AuthService);

  private readonly tickets = computed<Ticket[]>(() => {
    const name = this.auth.currentUser()?.fullName;
    return name ? ticketsByRequester(name) : [];
  });

  protected readonly recent = computed(() => this.tickets().slice(0, 6));

  protected readonly metrics = computed<Metric[]>(() => {
    const all = this.tickets();
    const count = (status: Ticket['status']) => all.filter((t) => t.status === status).length;
    return [
      { label: 'Pendientes', value: count('PENDIENTE'), hint: 'En espera de un técnico', modifier: 'pendiente' },
      { label: 'En proceso', value: count('EN_PROCESO'), hint: 'Un técnico está trabajando', modifier: 'en_proceso' },
      { label: 'Resueltos', value: count('RESUELTO'), hint: 'Solución entregada', modifier: 'resuelto' },
      { label: 'Cerrados', value: count('CERRADO'), hint: 'Cerrados y archivados', modifier: 'cerrado' },
    ];
  });
}
