import { Component, output } from '@angular/core';
import { ChatbotIcon } from './chatbot-header-icon/chatbot-header-icon';

@Component({
  selector: 'chatbot-header',
  imports: [ChatbotIcon],
  templateUrl: './chatbot-header.html',
})
export class ChatbotHeader {


  openChat = output<boolean>();

  closeChat() {

    this.openChat.emit(false);

  }
}
