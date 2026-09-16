import { Component, input } from '@angular/core';

@Component({
  selector: 'success-message',
  imports: [],
  templateUrl: './success-message.html',
})
export class SuccessMessage {

  messageTitle = input.required<string>();
  messageContent = input.required<string>();

}
