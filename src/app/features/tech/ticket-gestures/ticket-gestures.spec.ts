import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { TicketGestures } from './ticket-gestures';
import { AuthService } from '../../../core/services/auth.service';
import { TicketWorkflowService } from '../../../core/services/ticket-workflow.service';

function setup(ticketId: string) {
  return TestBed.configureTestingModule({
    imports: [TicketGestures],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      {
        provide: ActivatedRoute,
        useValue: { snapshot: { paramMap: convertToParamMap({ id: ticketId }) } },
      },
    ],
  }).compileComponents();
}

describe('TicketGestures', () => {
  let fixture: ComponentFixture<TicketGestures>;
  let component: TicketGestures;
  let workflow: TicketWorkflowService;

  const build = async (ticketId: string) => {
    await setup(ticketId);
    TestBed.inject(AuthService).setMockUser('TECHNICIAN');
    workflow = TestBed.inject(TicketWorkflowService);
    fixture = TestBed.createComponent(TicketGestures);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('shows the gesture history with the newest gesture on top (LIFO)', async () => {
    await build('TS-1005');

    const items = fixture.nativeElement.querySelectorAll('.tg__gesture');
    expect(items.length).toBe(3);

    const top = items[0] as HTMLElement;
    expect(top.classList).toContain('tg__gesture--top');
    expect(top.textContent).toContain('correos de prueba'); // g-3, the latest
  });

  it('pushes a new gesture to the top of the stack', async () => {
    await build('TS-1005');

    component.form.setValue({ type: 'SOLUTION', description: 'Se migra el buzón y queda estable.' });
    component.addGesture();
    fixture.detectChanges();

    expect(component.history().length).toBe(4);
    expect(component.history()[0].type).toBe('SOLUTION');

    const top = fixture.nativeElement.querySelector('.tg__gesture') as HTMLElement;
    expect(top.textContent).toContain('Se migra el buzón y queda estable.');
  });

  it('does not add a gesture when the description is too short', async () => {
    await build('TS-1005');

    component.form.setValue({ type: 'COMMENT', description: 'corto' });
    component.addGesture();

    expect(component.history().length).toBe(3);
  });

  it('changes the ticket status', async () => {
    await build('TS-1005');

    component.changeStatus('EN_ESPERA_USUARIO');
    fixture.detectChanges();

    expect(workflow.ticketById('TS-1005')?.status).toBe('EN_ESPERA_USUARIO');
    expect(component.ticket()?.status).toBe('EN_ESPERA_USUARIO');
  });

  it('generates an AI summary of the history', async () => {
    await build('TS-1005');

    expect(component.summary()).toBeNull();
    component.summarize();
    fixture.detectChanges();

    const text = component.summary();
    expect(text).toContain('TS-1005');
    expect(text).toContain('3 gestiones');
    expect(fixture.nativeElement.querySelector('.tg__summary')?.textContent).toContain('TS-1005');
  });

  it('renders a not-found message for an unknown ticket', async () => {
    await build('TS-0000');
    expect(fixture.nativeElement.textContent).toContain('Ticket no encontrado');
  });
});
