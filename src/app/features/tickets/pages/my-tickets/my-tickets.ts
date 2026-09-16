import { DatePipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TicketService } from '@features/tickets/services/ticket.service';
import { ImageGallery } from '@shared/components/image-gallery/image-gallery';
import { InitialsPipe } from '@shared/pipes';
import { MyTicketsHeader } from './my-tickets-header/my-tickets-header';
import { MyTicketsDeviceIcon } from './my-tickets-header/my-tickets-device-icon/my-tickets-device-icon';
import { IsLoading } from '@shared/components/is-loading/is-loading';
import { EmptyTickets } from '@features/tickets/shared/components/empty-tickets/empty-tickets';
import { NotSpecified } from './not-specified/not-specified';
import { NavigationService } from '@shared/services/navigation.service';
import { CloseTicket } from '@features/tickets/components/close-ticket/close-ticket';
import { EMPTY } from 'rxjs';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { TicketStatus } from '@features/tickets/shared/components/ticket-status/ticket-status';
import { TicketPriority } from '@features/tickets/shared/components/ticket-priority/ticket-priority';

@Component({
  selector: 'my-tickets',
  imports: [
    DatePipe,
    ImageGallery,
    InitialsPipe,
    MyTicketsHeader,
    MyTicketsDeviceIcon,
    IsLoading,
    EmptyTickets,
    NotSpecified,
    CloseTicket,
    SuccessMessage,
    ErrorMessage,
    TicketStatus,
    TicketPriority
],
  templateUrl: './my-tickets.html',
})
export class MyTickets {

  constructor(){
    effect(()=>{
      if(this.reopenTicketRxResource.hasValue() && this.reopenTicketButtonPressed()){
        this.ticketReopened.set(true);

        this.showMessageTimeout();
        this.reloadTimeout();
      }else if(this.reopenTicketRxResource.error() && this.reopenTicketButtonPressed()){
        this.showMessageTimeout();
      }
    });
  }

  ticketService = inject(TicketService);
  navigationService = inject(NavigationService);

  selectedTicketId = signal<number | null>(null);
  showCloseTicketModal = signal(false);
  reopenTicket = signal<number | null>(null);
  showMessage = signal<boolean>(false);
  ticketReopened = signal<boolean>(false);
  reopenTicketButtonPressed = signal<boolean>(false);

  myTicketsRxResource = rxResource({
    stream: () => this.ticketService.getMyTickets(),
  });

  reopenTicketRxResource = rxResource({
    params: () => ({ reopenTicket: this.reopenTicket() }),
    stream: ({ params }) => {
      if (!params.reopenTicket) return EMPTY;

      return this.ticketService.reopenTicket(params.reopenTicket);
    },
  });

  goToTicketDetail(id: number) {
    this.navigationService.goToTicketDetail(id);
  }

  openCloseTicket(ticketId: number): void {
    this.selectedTicketId.set(ticketId);
    this.showCloseTicketModal.set(true);
  }

  closeTicketModal(): void {
    this.showCloseTicketModal.set(false);
    this.selectedTicketId.set(null);
  }

  reopenTicketButton(id: number){

    const reopen = confirm(`Are you sure you want to reopen ticket with ID: ${id}?`);

    if(!reopen) return;

    this.reopenTicketButtonPressed.set(true);

    this.reopenTicket.set(id);

  }

  showMessageTimeout(){
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);
    }, 2000);
  }

  reloadTimeout(){
    setTimeout(() => {
      location.reload();
    }, 2000);
  }

  goToCreateTicket(){
    this.navigationService.goToCreateTicket();
  }
}
