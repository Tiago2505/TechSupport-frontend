import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { AgentResponse } from '../dtos';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private http = inject(HttpClient);
  private baseUrl = environment.BASE_URL;

  agent(message: string): Observable<AgentResponse>{

    return this.http.post<AgentResponse>(`${this.baseUrl}/agent`, { message });
  }
}
