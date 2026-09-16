import { Component, inject, input } from '@angular/core';
import { JwtPayload } from '@features/auth/interfaces';
import { Profile } from '@features/profile/profile';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'authenticated-navbar',
  imports: [Profile, RouterLink, RouterLinkActive ],
  templateUrl: './authenticated-navbar.html',
})
export class AuthenticatedNavbar {

  currentUser = input.required<JwtPayload>();


}
