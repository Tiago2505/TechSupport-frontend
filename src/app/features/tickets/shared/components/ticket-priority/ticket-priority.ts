import { Component, input } from '@angular/core';
import { PriorityTicket } from '@features/tickets/enums';

@Component({
  selector: 'ticket-priority',
  imports: [],
  templateUrl: './ticket-priority.html',
})
export class TicketPriority {
  ticketPriority = input.required<PriorityTicket>();
}
