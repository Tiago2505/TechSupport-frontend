import { Component, inject, signal } from '@angular/core';
import { Chatbot } from "@features/chatbot/chatbot";
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'authenticated-home',
  imports: [Chatbot],
  templateUrl: './authenticated-home.html',
})
export class AuthenticatedHome {

  navigationService = inject(NavigationService);

  goToCreateTicket(){
    this.navigationService.goToCreateTicket();
  }

}
