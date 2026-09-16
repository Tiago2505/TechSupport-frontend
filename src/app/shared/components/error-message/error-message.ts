import { Component, input } from '@angular/core';

@Component({
  selector: 'error-message',
  imports: [],
  templateUrl: './error-message.html',
})
export class ErrorMessage {

  messageTitle = input.required<string>();
  messageContent = input.required<string>();

}
