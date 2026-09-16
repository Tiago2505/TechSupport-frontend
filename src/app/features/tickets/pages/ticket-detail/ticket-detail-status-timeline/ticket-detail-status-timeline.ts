import { Component, input } from '@angular/core';
import { StatusTicket } from '@features/tickets/enums';
import { CheckStatusIcon } from './check-status-icon/check-status-icon';

@Component({
  selector: 'ticket-detail-status-timeline',
  imports: [CheckStatusIcon],
  templateUrl: './ticket-detail-status-timeline.html',
})
export class TicketDetailStatusTimeline {
  ticketStatus = input.required<StatusTicket>();
  assignedTechnician = input.required<boolean>();

  // CREATED
  isCreatedCompleted(): boolean {
    return true;
  }

  // ASSIGNED
  isAssignedCompleted(): boolean {
    return this.assignedTechnician();
  }

  isAssignedCurrent(): boolean {
    return !this.assignedTechnician() && this.ticketStatus() !== StatusTicket.CLOSED;
  }

  // RESOLVED
  isResolvedCompleted(): boolean {
    return this.ticketStatus() === StatusTicket.CLOSED;
  }

  isResolvedCurrent(): boolean {
    return this.assignedTechnician() && this.ticketStatus() !== StatusTicket.CLOSED;
  }
}
