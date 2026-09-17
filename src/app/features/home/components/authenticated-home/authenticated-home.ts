import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@features/auth/services/auth.service';
import { Chatbot } from "@features/chatbot/chatbot";
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'authenticated-home',
  imports: [Chatbot],
  templateUrl: './authenticated-home.html',
})
export class AuthenticatedHome {

  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  currentUser = this.authService.getUserFromToken();

  goToCreateTicket(){
    this.navigationService.goToCreateTicket();
  }

  goToAllTickets(){
    if(this.currentUser?.role === 'TECHNICIAN'){
      this.navigationService.goToTechnicianTickets();
    }else if(this.currentUser?.role === 'USER'){
      this.navigationService.goToMyTickets();
    }else{
      this.navigationService.goToAdminDashboard();
    }
  }



}
