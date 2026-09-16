

import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLogEntity } from '../entities';

@Injectable({providedIn: 'root'})
export class AuditLogService {

  private baseUrl = environment.BASE_URL;

  private http = inject(HttpClient);

  getAll(): Observable<AuditLogEntity[]>{
    return this.http.get<AuditLogEntity[]>(`${this.baseUrl}/audit`);
  }
  getById(id: number){
    return this.http.get<AuditLogEntity>(`${this.baseUrl}/audit/${id}`);
  }

}
