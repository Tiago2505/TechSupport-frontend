import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ticket-sort-controls',
  imports: [],
  templateUrl: './ticket-sort-controls.html',
})
export class TicketSortControls {

  sortAsQueue = input.required<()=>void>();
  sortAsStack = input.required<()=>void>();

}
