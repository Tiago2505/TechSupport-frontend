import { Component, input, output } from '@angular/core';
import { TicketWithTechnicianRelationEntity } from '@features/tickets/entities';
import { NoEvidence } from './no-evidence/no-evidence';
import { CreateTicketNote } from '@features/ticket-notes/components/create-ticket-note/create-ticket-note';
import { AllTicketNotes } from '@features/ticket-notes/components/all-ticket-notes/all-ticket-notes';
import { TicketNoteEntity } from '@features/ticket-notes/entities/ticket-note.entity';
import { CloseTicket } from '@features/tickets/components/close-ticket/close-ticket';
import { TicketResolution } from '@features/tickets/components/ticket-resolution/ticket-resolution';

@Component({
  selector: 'ticket-detail-left-sidebar',
  imports: [NoEvidence, CreateTicketNote, AllTicketNotes, CloseTicket, TicketResolution],
  templateUrl: './ticket-detail-left-sidebar.html',
})
export class TicketDetailLeftSidebar {

  ticket = input.required<TicketWithTechnicianRelationEntity>();

}
