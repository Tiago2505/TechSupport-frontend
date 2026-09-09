import { TestBed } from '@angular/core/testing';

import { AiChatService, ChatOption } from './ai-chat.service';

describe('AiChatService', () => {
  let service: AiChatService;

  const pick = (label: string): ChatOption => {
    const option = service.options().find((o) => o.label === label);
    if (!option) {
      throw new Error(`Option "${label}" not available. Got: ${service.options().map((o) => o.label).join(', ')}`);
    }
    return option;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiChatService);
    service.reset();
  });

  it('opens with a bot greeting and diagnostic options', () => {
    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].from).toBe('bot');
    expect(service.options().length).toBeGreaterThan(1);
    expect(service.inProgress()).toBeTrue();
    expect(service.needsTechnician()).toBeFalse();
  });

  it('records the user answer and asks the next diagnostic question', () => {
    service.choose(pick('El monitor no muestra imagen'));

    const messages = service.messages();
    expect(messages.some((m) => m.from === 'user' && m.text === 'El monitor no muestra imagen')).toBeTrue();
    expect(messages[messages.length - 1].text).toContain('No Signal');
  });

  it('reaches a self-service resolution without proposing a ticket', () => {
    service.choose(pick('El monitor no muestra imagen'));
    service.choose(pick('Sí')); // shows "No Signal"
    service.choose(pick('Sí')); // reconnecting the cable fixed it

    expect(service.inProgress()).toBeFalse();
    expect(service.needsTechnician()).toBeFalse();
    expect(service.suggestedTicket()).toBeNull();
  });

  it('proposes a pre-filled ticket when a technician is required', () => {
    service.choose(pick('El monitor no muestra imagen'));
    service.choose(pick('Sí')); // shows "No Signal"
    service.choose(pick('No')); // reconnecting the cable did not help

    expect(service.needsTechnician()).toBeTrue();
    const ticket = service.suggestedTicket();
    expect(ticket).not.toBeNull();
    expect(ticket!.title.length).toBeGreaterThan(0);
    expect(ticket!.description.length).toBeGreaterThan(0);
  });

  it('ignores further answers once an outcome is reached', () => {
    service.choose(pick('El equipo no enciende'));
    service.choose(pick('No'));
    service.choose(pick('No')); // technician outcome reached
    const count = service.messages().length;

    service.choose({ label: 'Sí', next: 'start' });
    expect(service.messages().length).toBe(count);
  });

  it('reset() clears the conversation back to the start', () => {
    service.choose(pick('El equipo va muy lento'));
    service.reset();

    expect(service.messages().length).toBe(1);
    expect(service.outcome()).toBeNull();
    expect(service.suggestedTicket()).toBeNull();
  });
});
