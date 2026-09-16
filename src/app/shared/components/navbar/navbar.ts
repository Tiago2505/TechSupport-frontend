import { Component, inject, input, signal } from '@angular/core';
import { JwtPayload } from '@features/auth/interfaces';
import { AuthService } from '@features/auth/services/auth.service';
import { NavigationService } from '@shared/services/navigation.service';
import { AuthenticatedNavbar } from './authenticated-navbar/authenticated-navbar';

@Component({
  selector: 'navbar',
  imports: [AuthenticatedNavbar],
  templateUrl: './navbar.html',
})
export class Navbar {
  authService = inject(AuthService);

  currentUser = signal<JwtPayload | null>(this.authService.getUserFromToken());

  navigationService = inject(NavigationService);

  goToLogin(){
    this.navigationService.goToLogin();
  }

  goToRegister(){
    this.navigationService.goToRegister();
  }

  goToHome(){
    this.navigationService.goToHome();
  }
}
