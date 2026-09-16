import { Component, inject } from '@angular/core';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'login-register-link',
  imports: [],
  templateUrl: './login-register-link.html',
})
export class LoginRegisterLink {

  navigationService = inject(NavigationService);


  goToRegister(){
    this.navigationService.goToRegister();
  }

}
