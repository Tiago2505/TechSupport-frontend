import { Component, inject } from '@angular/core';
import { NavigationService } from '@shared/services/navigation.service';
import { EmptyTicketsHeaderIcon } from './empty-tickets-header-icon/empty-tickets-header-icon';
import { EmptyTicketsButtonIcon } from './empty-tickets-button-icon/empty-tickets-button-icon';

@Component({
  selector: 'empty-tickets',
  imports: [EmptyTicketsHeaderIcon, EmptyTicketsButtonIcon],
  templateUrl: './empty-tickets.html',
})
export class EmptyTickets {
  navigationService = inject(NavigationService);

  goToCreateTicket (){
    this.navigationService.goToCreateTicket();
  }
}
