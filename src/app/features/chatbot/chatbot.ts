import { Component, effect, inject, signal } from '@angular/core';
import { ChatbotHeader } from './components/chatbot-header/chatbot-header';
import { ChatbotSendMessageIcon } from './components/chatbot-send-message-icon/chatbot-send-message-icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { ChatbotService } from './services/chatbot.service';
import { ChatbotMessage } from './components/chatbot-message/chatbot-message';
import { ChatbotUserMessage } from './components/chatbot-user-message/chatbot-user-message';
import { ChatbotMessageInterface } from './interfaces';
import { TypingIndicator } from './components/typing-indicator/typing-indicator';
import { ChatbotErrorMessage } from './components/chatbot-error-message/chatbot-error-message';

@Component({
  selector: 'chatbot',
  imports: [ChatbotHeader, ChatbotSendMessageIcon, ChatbotMessage, ChatbotUserMessage, ɵInternalFormsSharedModule, ReactiveFormsModule, TypingIndicator, ChatbotErrorMessage],
  templateUrl: './chatbot.html',
})
export class Chatbot {

  constructor(){
    effect(()=>{
      if(this.chatbotRxResource.hasValue()){
        this.messages.update((messages)=>[
          ...messages,
          {
            role: 'assistant',
            content: this.chatbotRxResource.value()?.message!
          }
        ]);
      }

    });
  }

  formBuilder = inject(FormBuilder);
  chatbotService = inject(ChatbotService);

  isOpen = signal<boolean>(false);
  message = signal<string | null>(null);
  messages = signal<ChatbotMessageInterface[]>([]);
  sendMessageButtonPressed = signal<boolean>(false);
  sendMessageAgainRequestId = signal<number>(0);

  chatbotForm: FormGroup = this.formBuilder.group({
    message: ['', [Validators.required]]
  });

  chatbotRxResource = rxResource({
  params: () => ({ message: this.message(), requestId: this.sendMessageAgainRequestId() }),

  stream: ({ params }) => {

    if (!params.message) return EMPTY;

    return this.chatbotService.agent(params.message);
  },
});

  sendMessageButton(){

    if(this.chatbotForm.invalid) return this.chatbotForm.markAllAsTouched();

    this.message.set(this.chatbotForm.get('message')?.value);

    this.messages.update(
      messages => [
        ...messages,
        {
          role: 'user',
          content: this.message()!
        }
      ]
    );

    this.sendMessageButtonPressed.set(true);

    this.clearInput();

  }

  openChat() {
    this.isOpen.set(true);
  }

  sendMessageAgain = ()=>{

    this.sendMessageAgainRequestId.update(value => value+1);

  }

  clearInput(){
    this.chatbotForm.get('message')?.setValue('');
  }

}
