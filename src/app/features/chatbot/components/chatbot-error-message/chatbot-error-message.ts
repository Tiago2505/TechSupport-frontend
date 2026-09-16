import { Component, input } from '@angular/core';

@Component({
  selector: 'chatbot-error-message',
  imports: [],
  templateUrl: './chatbot-error-message.html',
})
export class ChatbotErrorMessage {
  tryAgain = input.required<()=>void>();
}
