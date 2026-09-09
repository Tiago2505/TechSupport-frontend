import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { Chatbot } from './chatbot';
import { AiChatService } from './ai-chat.service';

describe('Chatbot', () => {
  let fixture: ComponentFixture<Chatbot>;
  let chat: AiChatService;

  const fab = () => fixture.nativeElement.querySelector('.chatbot__fab') as HTMLButtonElement;
  const window = () => fixture.nativeElement.querySelector('.chatbot__window') as HTMLElement | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chatbot],
      providers: [provideRouter([])],
    }).compileComponents();

    chat = TestBed.inject(AiChatService);
    chat.reset();
    fixture = TestBed.createComponent(Chatbot);
    fixture.detectChanges();
  });

  it('renders a floating action button and keeps the chat window closed initially', () => {
    expect(fab()).not.toBeNull();
    expect(window()).toBeNull();
  });

  it('opens and closes the chat window when the FAB is clicked', () => {
    fab().click();
    fixture.detectChanges();
    expect(window()).not.toBeNull();

    fab().click();
    fixture.detectChanges();
    expect(window()).toBeNull();
  });

  it('shows option buttons for the current diagnostic question', () => {
    fab().click();
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.chatbot__option');
    expect(options.length).toBe(chat.options().length);
  });

  it('offers the auto-create button and navigates to the pre-filled form', () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate');
    fab().click();
    fixture.detectChanges();

    // Walk a path that ends requiring a technician.
    chat.choose(chat.options().find((o) => o.label === 'El equipo no enciende')!);
    chat.choose(chat.options().find((o) => o.label === 'No')!);
    chat.choose(chat.options().find((o) => o.label === 'No')!);
    fixture.detectChanges();

    const cta = fixture.nativeElement.querySelector('.chatbot__cta') as HTMLButtonElement;
    expect(cta).not.toBeNull();

    cta.click();

    const ticket = chat.suggestedTicket()!;
    expect(navigate).toHaveBeenCalledWith(['/dashboard/tickets/new'], {
      queryParams: { title: ticket.title, description: ticket.description },
    });
  });
});
