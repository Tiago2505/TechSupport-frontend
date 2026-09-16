import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@features/auth/services/auth.service';
import { JwtPayload } from '@features/auth/interfaces';
import { AuthenticatedHome } from "./components/authenticated-home/authenticated-home";
import { PublicHome } from "./components/public-home/public-home";

@Component({
  selector: 'app-home',
  imports: [AuthenticatedHome, PublicHome],
  templateUrl: './home.html',
})
export class Home {

  authService = inject(AuthService);

  currentUser = signal<JwtPayload | null>(this.authService.getUserFromToken());

}
