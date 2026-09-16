import { Component, input } from '@angular/core';
import { StatusTicket } from '@features/tickets/enums';

@Component({
  selector: 'ticket-status',
  imports: [],
  templateUrl: './ticket-status.html',
})
export class TicketStatus {
  ticketStatus = input.required<StatusTicket>();
}
