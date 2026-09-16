import { Component, input } from '@angular/core';

@Component({
  selector: 'my-tickets-header',
  imports: [],
  templateUrl: './my-tickets-header.html',
})
export class MyTicketsHeader {
  totalTickets = input.required<number>();
}
