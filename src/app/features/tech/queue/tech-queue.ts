import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { TicketWorkflowService } from '../../../core/services/ticket-workflow.service';

/**
 * FIFO support queue (PRD §12). Pending tickets are served strictly in arrival
 * order: the oldest one is always at position #1 and is the next to be attended.
 */
@Component({
  selector: 'app-tech-queue',
  imports: [DatePipe],
  templateUrl: './tech-queue.html',
  styleUrl: './tech-queue.css',
})
export class TechQueue {
  private readonly workflow = inject(TicketWorkflowService);
  private readonly router = inject(Router);

  readonly queue = this.workflow.queue;

  protected attendNext(): void {
    const ticket = this.workflow.attendNext();
    if (ticket) {
      this.router.navigate(['/dashboard/tickets', ticket.id, 'manage']);
    }
  }

  protected manage(ticketId: string): void {
    this.router.navigate(['/dashboard/tickets', ticketId, 'manage']);
  }
}
