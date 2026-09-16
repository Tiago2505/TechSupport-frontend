import { Component, inject } from '@angular/core';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'public-home',
  imports: [],
  templateUrl: './public-home.html',
})
export class PublicHome {

  navigationService = inject(NavigationService);

  goToLogin(){
    return this.navigationService.goToLogin();
  }

  goToRegister(){
    return this.navigationService.goToRegister();
  }

}
