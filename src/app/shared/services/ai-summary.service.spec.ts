import { TestBed } from '@angular/core/testing';

import { AiSummaryService } from './ai-summary.service';
import { Gesture, Ticket } from '../../core/mock/mock-data';

const ticket: Ticket = {
  id: 'TS-9001',
  subject: 'Impresora sin red',
  category: 'Redes',
  status: 'EN_PROCESO',
  priority: 'MEDIA',
  requester: 'Ana Torres',
  assignee: 'Diego Ramírez',
  createdAt: '2026-09-01T09:00:00Z',
};

const gesture = (over: Partial<Gesture>): Gesture => ({
  id: 'g-x',
  ticketId: 'TS-9001',
  type: 'COMMENT',
  description: 'Nota',
  author: 'Diego Ramírez',
  createdAt: '2026-09-01T10:00:00Z',
  ...over,
});

describe('AiSummaryService', () => {
  let service: AiSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiSummaryService);
  });

  it('handles a ticket with no gestures', () => {
    const text = service.summarize(ticket, []);
    expect(text).toContain('TS-9001');
    expect(text).toContain('no tiene gestiones registradas');
  });

  it('summarises the case referencing count, diagnosis and last action', () => {
    // history is newest-first, as the view passes it
    const history: Gesture[] = [
      gesture({ id: 'g-3', type: 'TEST', description: 'Se prueba la impresión y funciona', createdAt: '2026-09-01T12:00:00Z' }),
      gesture({ id: 'g-2', type: 'REPAIR', description: 'Se reinstala el driver de red de la impresora', createdAt: '2026-09-01T11:00:00Z' }),
      gesture({ id: 'g-1', type: 'DIAGNOSIS', description: 'La impresora no responde a ping', createdAt: '2026-09-01T10:00:00Z' }),
    ];

    const text = service.summarize(ticket, history);

    expect(text).toContain('3 gestiones');
    expect(text).toContain('diagnóstico');
    expect(text.toLowerCase()).toContain('no responde a ping');
    expect(text).toContain('El ticket sigue abierto');
  });

  it('mentions the applied solution and closure when a SOLUTION gesture exists', () => {
    const resolved: Ticket = { ...ticket, status: 'RESUELTO' };
    const history: Gesture[] = [
      gesture({ id: 'g-2', type: 'SOLUTION', description: 'Se asigna IP fija y queda en red', createdAt: '2026-09-01T11:00:00Z' }),
      gesture({ id: 'g-1', type: 'DIAGNOSIS', description: 'Conflicto de DHCP', createdAt: '2026-09-01T10:00:00Z' }),
    ];

    const text = service.summarize(resolved, history);

    expect(text).toContain('Solución aplicada');
    expect(text).toContain('no requiere más intervención');
  });
});
