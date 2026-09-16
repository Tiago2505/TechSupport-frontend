import { Component, input } from '@angular/core';
import { JwtPayload } from '@features/auth/interfaces';
import { InitialsPipe } from '@shared/pipes';

@Component({
  selector: 'dashboard-header',
  imports: [InitialsPipe],
  templateUrl: './dashboard-header.html',
})
export class DashboardHeader {

  currentUser = input.required<JwtPayload>();

}
