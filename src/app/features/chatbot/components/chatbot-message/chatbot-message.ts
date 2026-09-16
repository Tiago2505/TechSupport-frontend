import { Component, input } from '@angular/core';
import { ChatbotMessageIcon } from './chatbot-message-icon/chatbot-message-icon';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'chatbot-message',
  imports: [ChatbotMessageIcon, MarkdownComponent],
  templateUrl: './chatbot-message.html',
})
export class ChatbotMessage {
  messageContent = input.required<string>();


}
