import { Component, effect, inject, input, signal } from '@angular/core';
import { TicketWithCreatedByRelationEntity } from '@features/tickets/entities/ticket-with-created-by-relation.entity';
import { NavigationService } from '@shared/services/navigation.service';
import { UtilsClass } from '@shared/utils/utils.class';
import { TicketService } from '../../services/ticket.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { IsLoading } from '@shared/components/is-loading/is-loading';

@Component({
  selector: 'ticket-management',
  imports: [SuccessMessage, ErrorMessage, IsLoading],
  templateUrl: './ticket-management.html',
})
export class TicketManagement {
  constructor() {
    effect(() => {
      if (this.tickets()) {
        this.firstThreeTickets.set(
          this.tickets()
            .sort((a, b) => a.id - b.id)
            .slice(0, 3),
        );
      }
    });

    effect(()=>{
      if(this.deleteTicketRxResource.hasValue() && this.deleteTicketButtonPressed()){
        this.ticketDeleted.set(true);

        this.showMessageTimeout();

        setTimeout(() => {
          location.reload();
        }, 2000);

      }else if(this.deleteTicketRxResource.error() && this.deleteTicketButtonPressed()){
        this.showMessageTimeout();
      }
    });
  }

  tickets = input.required<TicketWithCreatedByRelationEntity[]>();

  navigationService = inject(NavigationService);
  ticketService = inject(TicketService);

  firstThreeTickets = signal<TicketWithCreatedByRelationEntity[]>([]);
  showAllTickets = signal<boolean>(false);
  deleteTicketId = signal<number | null>(null);
  ticketDeleted = signal<boolean>(false);
  showMessage = signal<boolean>(false);
  deleteTicketButtonPressed = signal<boolean>(false);


  deleteTicketRxResource = rxResource({
    params: ()=>({deleteTicketId: this.deleteTicketId()}),
    stream: ({params})=>{
      if(!params.deleteTicketId) return EMPTY;

      return this.ticketService.deleteTicket(params.deleteTicketId);
    }
  })

  getTimeAgo(date: string): string{
    return UtilsClass.getTimeAgo(date);
  }

  showAllTicketsButton(){
    this.showAllTickets() ? this.showAllTickets.set(false) : this.showAllTickets.set(true);
  }

  goToUpdateTicket(id: number){
    this.navigationService.goToUpdateTicket(id);
  }

  deleteTicketButton(id: number){
    const deleteTicket = confirm(`Are you sure you want to delete ticket with id: ${id}?`)
    if(!deleteTicket) return;

    this.deleteTicketButtonPressed.set(true);

    this.deleteTicketId.set(id);
  }

  showMessageTimeout(){
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);
    }, 2000);
  }
}
