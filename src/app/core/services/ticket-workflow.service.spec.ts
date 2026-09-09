import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TicketWorkflowService } from './ticket-workflow.service';
import { AuthService } from './auth.service';

describe('TicketWorkflowService', () => {
  let service: TicketWorkflowService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    TestBed.inject(AuthService).setMockUser('TECHNICIAN');
    service = TestBed.inject(TicketWorkflowService);
  });

  afterEach(() => localStorage.clear());

  it('orders the queue oldest-first (FIFO)', () => {
    const queue = service.queue();
    expect(queue.length).toBeGreaterThan(1);
    expect(queue[0].id).toBe('TS-1001');

    const times = queue.map((t) => new Date(t.createdAt).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('attendNext() dequeues the head, sets it IN_PROGRESS and assigns the technician', () => {
    const head = service.queue()[0];

    const attended = service.attendNext();

    expect(attended?.id).toBe(head.id);
    expect(attended?.status).toBe('EN_PROCESO');
    expect(attended?.assignee).toBe('Diego Ramírez');
    expect(service.queue().some((t) => t.id === head.id)).toBeFalse();
    expect(service.ticketById(head.id)?.status).toBe('EN_PROCESO');
  });

  it('attendNext() serves tickets strictly in arrival order', () => {
    const expected = service.queue().map((t) => t.id);
    const served: string[] = [];

    for (let i = 0; i < expected.length; i += 1) {
      served.push(service.attendNext()!.id);
    }

    expect(served).toEqual(expected);
    expect(service.attendNext()).toBeNull();
  });

  it('gestureHistory() returns the newest gesture first (LIFO)', () => {
    const history = service.gestureHistory('TS-1005');
    expect(history.map((g) => g.id)).toEqual(['g-3', 'g-2', 'g-1']);
  });

  it('addGesture() pushes the new gesture on top of the stack', () => {
    const before = service.gestureHistory('TS-1005').length;

    const created = service.addGesture('TS-1005', 'SOLUTION', '  Se reinstala el cliente y queda operativo.  ');

    const history = service.gestureHistory('TS-1005');
    expect(history.length).toBe(before + 1);
    expect(history[0].id).toBe(created.id);
    expect(history[0].type).toBe('SOLUTION');
    expect(history[0].description).toBe('Se reinstala el cliente y queda operativo.');
    expect(history[0].author).toBe('Diego Ramírez');
  });

  it('setStatus() updates the ticket status', () => {
    service.setStatus('TS-1005', 'RESUELTO');
    expect(service.ticketById('TS-1005')?.status).toBe('RESUELTO');
  });
});
