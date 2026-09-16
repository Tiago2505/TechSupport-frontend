import { Component, effect, inject, input, signal } from '@angular/core';
import { TicketNoteService } from '../../services/ticket-note.service';
import { TicketNoteWithRelationsEntity } from '../../entities/ticket-note-with-relations.entity';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { InitialsPipe } from '@shared/pipes';
import { DatePipe } from '@angular/common';
import { IsLoading } from '@shared/components/is-loading/is-loading';

@Component({
  selector: 'all-ticket-notes',
  imports: [InitialsPipe, DatePipe, IsLoading],
  templateUrl: './all-ticket-notes.html',
})
export class AllTicketNotes {

  constructor() {
    effect(() => {
      if (this.ticketNotesRxResource.hasValue()) {
        this.ticketNotes.set(this.ticketNotesRxResource.value());
      }
    });
  }

  ticketId = input.required<number>();

  ticketNoteService = inject(TicketNoteService);

  ticketNotes = signal<TicketNoteWithRelationsEntity[] | null>(null);

  ticketNotesRxResource = rxResource({
    params: ()=>({id: this.ticketId() }),
    stream:({params})=>{
      if(!params.id) return EMPTY;

      return this.ticketNoteService.getAllTicketNotes(Number(params.id));
    }
  });


}
