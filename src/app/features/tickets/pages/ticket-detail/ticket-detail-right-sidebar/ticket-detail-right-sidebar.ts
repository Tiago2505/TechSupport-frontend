import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { TicketWithTechnicianRelationEntity } from '@features/tickets/entities';
import { InitialsPipe } from '@shared/pipes';
import { NoTechnician } from './no-technician/no-technician';
import { TicketStatus } from '@features/tickets/shared/components/ticket-status/ticket-status';
import { TicketPriority } from '@features/tickets/shared/components/ticket-priority/ticket-priority';
import { AiTicketDiagnosis } from './ai-ticket-diagnosis/ai-ticket-diagnosis';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'ticket-detail-right-sidebar',
  imports: [InitialsPipe, DatePipe, NoTechnician, TicketStatus, TicketPriority, AiTicketDiagnosis],
  templateUrl: './ticket-detail-right-sidebar.html',
})
export class TicketDetailRightSidebar {



  ticket = input.required<TicketWithTechnicianRelationEntity>();

  authService = inject(AuthService);

  currentUser = this.authService.getUserFromToken();



}
