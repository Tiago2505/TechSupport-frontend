import { Component, input } from '@angular/core';

@Component({
  selector: 'ticket-resolution',
  imports: [],
  templateUrl: './ticket-resolution.html',
})
export class TicketResolution {
  resolution = input.required<string>();
}
