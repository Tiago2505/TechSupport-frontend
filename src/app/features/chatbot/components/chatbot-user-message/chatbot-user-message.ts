import { Component, input } from '@angular/core';

@Component({
  selector: 'chatbot-user-message',
  imports: [],
  templateUrl: './chatbot-user-message.html',
})
export class ChatbotUserMessage {
  messageContent = input.required<string>();
}
