import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class NavigationService {

  router = inject(Router);

  goToLogin(){
    this.router.navigate(['/auth/login']);
  }

  goToRegister(){
    this.router.navigate(['/auth/register']);
  }

  goToHome(){
    this.router.navigate(['/home']);
  }

  gotToForgotPassword(){
    this.router.navigate(['/auth/forgot-password']);
  }

  goToVerifYPasswordResetCode(){

    this.router.navigate(['/auth/verify-code']);
  }

  goToResetPassword(){
    this.router.navigate(['/auth/reset-password']);
  }

  goToChangePassword(){
    this.router.navigate(['/auth/change-password']);
  }

  goToCreateTicket(){
    this.router.navigate(['/tickets/create']);
  }

  goToMyTickets(){
    this.router.navigate(['/tickets/my-tickets']);
  }

  goToTicketDetail(id: number){
    this.router.navigate([`/tickets/my-tickets/${id}`]);
  }

  goToTechnicianTickets(){
    this.router.navigate(['/tickets/technician-tickets']);
  }

  goToUpdateTicket(id: number){
    this.router.navigate([`/tickets/update/${id}`]);
  }

  goToUsersManagement(){
    this.router.navigate(['/users/management']);
  }

  goToUpdateUser(id: number){
    this.router.navigate([`/users/update/${id}`]);
  }

}
