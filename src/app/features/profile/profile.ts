import { Component, inject, input, signal } from '@angular/core';
import { JwtPayload } from '@features/auth/interfaces';
import { AuthService } from '@features/auth/services/auth.service';
import { NavigationService } from '@shared/services/navigation.service';
import { SuccessMessage } from '@shared/components/success-message/success-message';

@Component({
  selector: 'profile',
  imports: [SuccessMessage],
  templateUrl: './profile.html',
})
export class Profile {
  currentUser = input.required<JwtPayload>();
  navigationService = inject(NavigationService);
  authService = inject(AuthService);

  isOpen = signal<boolean>(false);
  showMessage = signal<boolean>(false);

  openProfile() {
    this.isOpen.set(true);
  }

  closeProfile() {
    this.isOpen.set(false);
  }

  goToChangePassword() {
    this.navigationService.goToChangePassword();
  }

  logout() {
    this.showMessageTimeout();

    this.authService.logout();
  }

  showMessageTimeout(){
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);
      location.reload();
    }, 2000);
  }
}
