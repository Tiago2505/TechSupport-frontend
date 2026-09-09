import { computed, inject, Injectable, signal } from '@angular/core';

import { AuthService } from './auth.service';
import {
  Gesture,
  GestureType,
  MOCK_GESTURES,
  MOCK_TICKETS,
  Ticket,
  TicketStatus,
} from '../mock/mock-data';
import { Queue } from '../utils/queue';
import { Stack } from '../utils/stack';

const byCreatedAtAsc = (a: { createdAt: string }, b: { createdAt: string }) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

/** Statuses a technician can move a ticket to from the management view (PRD §13). */
export const TECH_STATUS_OPTIONS: TicketStatus[] = ['EN_ESPERA_USUARIO', 'RESUELTO', 'CERRADO'];

/**
 * In-memory ticket workflow backed by signals. The pending list behaves as a
 * FIFO {@link Queue} (PRD §12) and each ticket's history behaves as a LIFO
 * {@link Stack} (PRD §13).
 */
@Injectable({ providedIn: 'root' })
export class TicketWorkflowService {
  private readonly auth = inject(AuthService);

  private readonly _tickets = signal<Ticket[]>(MOCK_TICKETS.map((ticket) => ({ ...ticket })));
  private readonly _gestures = signal<Gesture[]>(MOCK_GESTURES.map((gesture) => ({ ...gesture })));
  private seq = 0;

  readonly tickets = this._tickets.asReadonly();

  /** Pending tickets as a FIFO queue: head is the oldest arrival. */
  readonly queue = computed<Ticket[]>(() => {
    const pending = this._tickets()
      .filter((ticket) => ticket.status === 'PENDIENTE')
      .sort(byCreatedAtAsc);
    return new Queue<Ticket>(pending).toArray();
  });

  readonly queueLength = computed(() => this.queue().length);

  ticketById(id: string): Ticket | undefined {
    return this._tickets().find((ticket) => ticket.id === id);
  }

  /**
   * Dequeues the oldest pending ticket (FIFO), assigns it to the current
   * technician and moves it to IN_PROGRESS. Returns the updated ticket, or
   * `null` when the queue is empty.
   */
  attendNext(): Ticket | null {
    const queue = new Queue<Ticket>(this.queue());
    const next = queue.dequeue();
    if (!next) {
      return null;
    }
    const assignee = this.auth.currentUser()?.fullName ?? next.assignee;
    return this.updateTicket(next.id, { status: 'EN_PROCESO', assignee });
  }

  /** Ticket history as a LIFO stack: the most recent gesture comes first. */
  gestureHistory(ticketId: string): Gesture[] {
    const chronological = this._gestures()
      .filter((gesture) => gesture.ticketId === ticketId)
      .sort(byCreatedAtAsc);
    return new Stack<Gesture>(chronological).toArrayLifo();
  }

  /** Pushes a new gesture on top of the ticket's history stack. */
  addGesture(ticketId: string, type: GestureType, description: string): Gesture {
    const gesture: Gesture = {
      id: `g-${Date.now()}-${(this.seq += 1)}`,
      ticketId,
      type,
      description: description.trim(),
      author: this.auth.currentUser()?.fullName ?? 'Técnico',
      createdAt: new Date().toISOString(),
    };
    this._gestures.update((all) => [...all, gesture]);
    return gesture;
  }

  setStatus(ticketId: string, status: TicketStatus): Ticket | null {
    return this.updateTicket(ticketId, { status });
  }

  private updateTicket(id: string, patch: Partial<Ticket>): Ticket | null {
    let updated: Ticket | null = null;
    this._tickets.update((all) =>
      all.map((ticket) => {
        if (ticket.id !== id) {
          return ticket;
        }
        updated = { ...ticket, ...patch };
        return updated;
      }),
    );
    return updated;
  }
}
