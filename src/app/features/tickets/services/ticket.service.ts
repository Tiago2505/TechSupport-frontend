


import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { TicketEntity, TicketWithTechnicianRelationEntity } from '../entities';
import { TicketWithCreatedByRelationEntity } from '../entities/ticket-with-created-by-relation.entity';
import { UpdateTicketDto } from '../dtos';

@Injectable({providedIn: 'root'})
export class TicketService {

  private baseUrl = environment.BASE_URL;

  private http = inject(HttpClient);

  createTicket(createTicketFormData: FormData):Observable<TicketEntity>{
    return this.http.post<TicketEntity>(`${this.baseUrl}/tickets`, createTicketFormData);
  }

  getMyTickets(): Observable<TicketWithTechnicianRelationEntity[]>{
    return this.http.get<TicketWithTechnicianRelationEntity[]>(`${this.baseUrl}/tickets/user`)
  }

  getTicketById(id: number):Observable<TicketEntity>{
    return this.http.get<TicketEntity>(`${this.baseUrl}/tickets/${id}`);
  }

  getTicketWithTechnicianRelations(id: number):Observable<TicketWithTechnicianRelationEntity>{
    return this.http.get<TicketWithTechnicianRelationEntity>(`${this.baseUrl}/tickets/${id}/with-user`);
  }

  closeTicket(id: number, resolution: string): Observable<TicketEntity>{
    return this.http.post<TicketEntity>(`${this.baseUrl}/tickets/close/${id}`, {resolution});
  }

  reopenTicket(id: number):Observable<TicketEntity>{
    return this.http.post<TicketEntity>(`${this.baseUrl}/tickets/reopen/${id}`, {});
  }

  getAllTickets(): Observable<TicketWithCreatedByRelationEntity[]>{
    return this.http.get<TicketWithCreatedByRelationEntity[]>(`${this.baseUrl}/tickets`);
  }

  claimTicket(id: number){
    return this.http.get(`${this.baseUrl}/tickets/${id}/claim`)
  }

  updateTicket(ticketId: number, updateFormData: FormData): Observable<TicketEntity>{
    return this.http.patch<TicketEntity>(`${this.baseUrl}/tickets/${ticketId}`, updateFormData);
  }

  deleteTicket(id: number){
    return this.http.delete(`${this.baseUrl}/tickets/${id}`);
  }
}
