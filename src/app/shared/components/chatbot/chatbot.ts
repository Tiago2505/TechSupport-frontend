import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AiChatService, ChatOption } from './ai-chat.service';

/**
 * Floating AI assistant (PRD §19). A fixed FAB in the bottom-right corner opens
 * a chat window that runs a scripted pre-diagnosis. When the issue needs a
 * technician it offers to open the ticket form with the title and description
 * pre-filled.
 */
@Component({
  selector: 'app-chatbot',
  imports: [],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot {
  private readonly chat = inject(AiChatService);
  private readonly router = inject(Router);

  protected readonly open = signal(false);

  protected readonly messages = this.chat.messages;
  protected readonly options = this.chat.options;
  protected readonly needsTechnician = this.chat.needsTechnician;
  protected readonly inProgress = this.chat.inProgress;

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected choose(option: ChatOption): void {
    this.chat.choose(option);
  }

  protected restart(): void {
    this.chat.reset();
  }

  /** Opens the new-ticket form with the suggested title/description pre-filled. */
  protected createRequest(): void {
    const ticket = this.chat.suggestedTicket();
    if (!ticket) {
      return;
    }

    this.open.set(false);
    this.router.navigate(['/dashboard/tickets/new'], {
      queryParams: { title: ticket.title, description: ticket.description },
    });
  }
}
