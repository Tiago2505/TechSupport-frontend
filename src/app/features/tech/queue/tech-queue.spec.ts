import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { TechQueue } from './tech-queue';
import { AuthService } from '../../../core/services/auth.service';
import { TicketWorkflowService } from '../../../core/services/ticket-workflow.service';

describe('TechQueue', () => {
  let fixture: ComponentFixture<TechQueue>;
  let workflow: TicketWorkflowService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TechQueue],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    TestBed.inject(AuthService).setMockUser('TECHNICIAN');
    workflow = TestBed.inject(TicketWorkflowService);
    fixture = TestBed.createComponent(TechQueue);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('numbers the queue from #1 with the oldest ticket first', () => {
    const rows = fixture.nativeElement.querySelectorAll('.ts-table tbody tr');
    expect(rows.length).toBe(workflow.queue().length);

    const firstRow = rows[0] as HTMLElement;
    expect(firstRow.querySelector('.queue__pos')?.textContent?.trim()).toContain('#1');
    expect(firstRow.textContent).toContain(workflow.queue()[0].id);
  });

  it('"Atender Siguiente Ticket" dequeues the head and navigates to its management view', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    const head = workflow.queue()[0];
    const initialLength = workflow.queue().length;

    const button = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((b) => b.textContent?.includes('Atender Siguiente Ticket'))!;
    button.click();
    fixture.detectChanges();

    expect(workflow.ticketById(head.id)?.status).toBe('EN_PROCESO');
    expect(workflow.queue().length).toBe(initialLength - 1);
    expect(navigate).toHaveBeenCalledWith(['/dashboard/tickets', head.id, 'manage']);
  });

  it('disables the action when the queue is empty', () => {
    while (workflow.attendNext()) {
      /* drain */
    }
    fixture.detectChanges();

    const button = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((b) => b.textContent?.includes('Atender Siguiente Ticket'))!;
    expect(button.disabled).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('No hay tickets pendientes');
  });
});
