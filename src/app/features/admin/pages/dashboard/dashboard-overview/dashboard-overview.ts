import { Component, input } from '@angular/core';

@Component({
  selector: 'dashboard-overview',
  imports: [],
  templateUrl: './dashboard-overview.html',
})
export class DashboardOverview {
  ticketsLength = input.required<number>();
  usersLength = input.required<number>();
  auditLogsLength = input.required<number>();
}
