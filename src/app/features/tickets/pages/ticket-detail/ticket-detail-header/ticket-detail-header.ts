import { Component, effect, inject, input, signal } from '@angular/core';
import { PriorityTicket, StatusTicket } from '@features/tickets/enums';
import { NavigationService } from '@shared/services/navigation.service';
import { UtilsClass } from '@shared/utils/utils.class';
import { TicketPriority } from '@features/tickets/shared/components/ticket-priority/ticket-priority';
import { TicketStatus } from '@features/tickets/shared/components/ticket-status/ticket-status';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { TicketService } from '@features/tickets/services/ticket.service';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { IsLoading } from '@shared/components/is-loading/is-loading';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'ticket-detail-header',
  imports: [TicketPriority, TicketStatus, SuccessMessage, ErrorMessage, IsLoading],
  templateUrl: './ticket-detail-header.html',
})
export class TicketDetailHeader {
  constructor() {
    effect(() => {
      if (this.claimTicketRxResource.hasValue() && this.claimTicketButtonPressed()) {
        this.claimedTicket.set(true);

        this.showMessageTimeout();
      } else if (this.claimTicketRxResource.error() && this.claimTicketButtonPressed()) {
        this.showMessageTimeout();
      }
    });
  }

  ticketId = input.required<number>();
  ticketStatus = input.required<StatusTicket>();
  ticketTitle = input.required<string>();
  lastUpdate = input.required<string>();
  priorityTicket = input.required<PriorityTicket>();

  navigationService = inject(NavigationService);
  ticketService = inject(TicketService);
  authService = inject(AuthService);

  claimTicketId = signal<number | null>(null);
  claimedTicket = signal<boolean>(false);
  showMessage = signal<boolean>(false);
  claimTicketButtonPressed = signal<boolean>(false);

  claimTicketRxResource = rxResource({
    params: () => ({ ticketId: this.claimTicketId() }),
    stream: ({ params }) => {
      if (!params.ticketId) return EMPTY;

      return this.ticketService.claimTicket(params.ticketId);
    },
  });

  getTimeAgo(): string {
    return UtilsClass.getTimeAgo(this.lastUpdate());
  }

  goToAllTickets() {
    const user = this.authService.getUserFromToken();

    if (user?.role === 'USER') {
      this.navigationService.goToMyTickets();
    } else if (user?.role === 'TECHNICIAN') {
      this.navigationService.goToTechnicianTickets();
    }
  }

  claimTicketButton(id: number) {
    this.claimTicketButtonPressed.set(true);

    this.claimTicketId.set(id);
  }

  goToUpdateTicket(){
    this.navigationService.goToUpdateTicket(this.ticketId());
  }

  showMessageTimeout() {
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);
      location.reload();
    }, 2000);
  }
}
