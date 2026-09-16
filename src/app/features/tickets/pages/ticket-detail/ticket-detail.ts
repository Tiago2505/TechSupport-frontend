import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '@features/tickets/services/ticket.service';
import { NavigationService } from '@shared/services/navigation.service';
import { EMPTY } from 'rxjs';
import { IsLoading } from '@shared/components/is-loading/is-loading';
import { TicketDetailHeader } from './ticket-detail-header/ticket-detail-header';
import { TicketDetailStatusTimeline } from './ticket-detail-status-timeline/ticket-detail-status-timeline';
import { TicketDetailLeftSidebar } from './ticket-detail-left-sidebar/ticket-detail-left-sidebar';
import { TicketDetailRightSidebar } from './ticket-detail-right-sidebar/ticket-detail-right-sidebar';
import { TicketNoteService } from '@features/ticket-notes/services/ticket-note.service';
import { TicketNoteWithRelationsEntity } from '@features/ticket-notes/entities/ticket-note-with-relations.entity';
import { TicketWithTechnicianRelationEntity } from '@features/tickets/entities';
import { NotFound } from '@shared/components/not-found/not-found';

@Component({
  selector: 'app-ticket-detail',
  imports: [
    IsLoading,
    TicketDetailHeader,
    TicketDetailStatusTimeline,
    TicketDetailLeftSidebar,
    TicketDetailRightSidebar,
    NotFound
],
  templateUrl: './ticket-detail.html',
})
export class TicketDetail {
  constructor() {
    effect(() => {
      if (this.ticketDetailRxResource.hasValue()) {
        this.ticketInformation.set(this.ticketDetailRxResource.value());
      }
    });

    effect(() => {
      if (this.ticketNotesRxResource.hasValue()) {
        this.ticketNotes.set(this.ticketNotesRxResource.value());
      }
    });

  }

  activatedRoute = inject(ActivatedRoute);
  ticketService = inject(TicketService);
  navigationService = inject(NavigationService);
  ticketNoteService = inject(TicketNoteService);

  ticketId = this.activatedRoute.snapshot.paramMap.get('id');

  ticketInformation = signal<TicketWithTechnicianRelationEntity | null>(null);
  ticketNotes = signal<TicketNoteWithRelationsEntity[]>([]);


  ticketDetailRxResource = rxResource({
    params: () => ({ ticketId: this.ticketId }),
    stream: ({ params }) => {
      if (!params.ticketId) {
        this.navigationService.goToMyTickets();

        return EMPTY;
      }

      return this.ticketService.getTicketWithTechnicianRelations(Number(this.ticketId));
    },
  });

  ticketNotesRxResource = rxResource({
    params: ()=>({ticketId: this.ticketId}),
    stream: ({params})=>{
      if(!params.ticketId) return EMPTY;

      return this.ticketNoteService.getAllTicketNotes(Number(params.ticketId));
    }
  })

  getLastNoteCreatedAt(){
    return this.ticketNotes()[this.ticketNotes().length -1].createdAt;
  }



}
