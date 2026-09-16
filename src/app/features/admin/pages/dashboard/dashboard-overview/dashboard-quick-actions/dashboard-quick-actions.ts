import { Component, inject } from '@angular/core';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'dashboard-quick-actions',
  imports: [],
  templateUrl: './dashboard-quick-actions.html',
})
export class DashboardQuickActions {
  navigationService = inject(NavigationService);

  goToUsersManagement(){
    this.navigationService.goToUsersManagement();
  }
}
