
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { TicketNoteEntity } from '../entities/ticket-note.entity';
import { Observable } from 'rxjs';
import { TicketNoteWithRelationsEntity } from '../entities/ticket-note-with-relations.entity';

@Injectable({providedIn: 'root'})
export class TicketNoteService {

  private baseUrl = environment.BASE_URL;
  private http = inject(HttpClient);

  createTicketNote(id: number, content: string): Observable<TicketNoteEntity>{
    return this.http.post<TicketNoteEntity>(`${this.baseUrl}/ticket-notes/${id}`, {content});
  }

  getAllTicketNotes(id: number): Observable<TicketNoteWithRelationsEntity[]>{
    return this.http.get<TicketNoteWithRelationsEntity[]>(`${this.baseUrl}/ticket-notes/by-ticket/${id}`);
  }

}
