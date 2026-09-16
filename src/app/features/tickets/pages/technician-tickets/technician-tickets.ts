import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { TicketWithCreatedByRelationEntity } from '@features/tickets/entities/ticket-with-created-by-relation.entity';
import { TicketService } from '@features/tickets/services/ticket.service';
import { TicketStatus } from '@features/tickets/shared/components/ticket-status/ticket-status';
import { TicketPriority } from '@features/tickets/shared/components/ticket-priority/ticket-priority';

import { NavigationService } from '@shared/services/navigation.service';
import { UtilsClass } from '@shared/utils/utils.class';
import { TicketSortControls } from './ticket-sort-controls/ticket-sort-controls';

@Component({
  selector: 'app-technician-tickets',
  imports: [TicketStatus, TicketPriority, TicketSortControls],
  templateUrl: './technician-tickets.html',
})
export class TechnicianTickets {
  ticketService = inject(TicketService);
  navigationService = inject(NavigationService);

  tickets = signal<TicketWithCreatedByRelationEntity[]>([]);

  allTicketsRxResource = rxResource({
    stream: () => this.ticketService.getAllTickets(),
  });

  constructor() {
    effect(() => {
      if (this.allTicketsRxResource.hasValue()) {
        this.tickets.set(this.allTicketsRxResource.value());
      }
    });
  }

  getTimeAgo(date: string): string {
    return UtilsClass.getTimeAgo(date);
  }

  goToTicketDetail(id: number) {
    this.navigationService.goToTicketDetail(id);
  }

  sortAsQueue=(): void => {
    const sortedTickets = [...this.tickets()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    this.tickets.set(UtilsClass.sortAsQueue(sortedTickets));
  }

  sortAsStack = (): void => {
    const sortedTickets = [...this.tickets()].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    this.tickets.set(UtilsClass.sortAsStack(sortedTickets));
  }
}
