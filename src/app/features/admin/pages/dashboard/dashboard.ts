import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '@features/auth/services/auth.service';
import { TicketService } from '@features/tickets/services/ticket.service';
import { DashboardHeader } from './dashboard-header/dashboard-header';
import { rxResource } from '@angular/core/rxjs-interop';
import { TicketWithCreatedByRelationEntity } from '@features/tickets/entities/ticket-with-created-by-relation.entity';
import { UserService } from '@features/users/services/user.service';
import { UserEntity } from '@features/users/entities';
import { DashboardOverview } from './dashboard-overview/dashboard-overview';
import { DashboardQuickActions } from './dashboard-overview/dashboard-quick-actions/dashboard-quick-actions';
import { TicketManagement } from '@features/tickets/components/ticket-management/ticket-management';
import { InitialsPipe } from '@shared/pipes';
import { AuditLogEntity } from '@features/auditLogs/entities';
import { AuditLogService } from '@features/auditLogs/services/auditLog.service';
import { UpdateIcon } from './update-icon/update-icon';
import { DeleteIcon } from './delete-icon/delete-icon';
import { UtilsClass } from '@shared/utils/utils.class';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardHeader, DashboardOverview, DashboardQuickActions, TicketManagement, InitialsPipe, UpdateIcon, DeleteIcon],
  templateUrl: './dashboard.html',
})
export class Dashboard {

  constructor(){
    effect(()=>{
      if(this.getAllTicketsRxResource.hasValue()){
        this.allTickets.set(this.getAllTicketsRxResource.value());
      }
    });

    effect(()=>{
      if(this.getAllUsersRxResource.hasValue()){
        this.allUsers.set(this.getAllUsersRxResource.value())
      }
    });

    effect(()=>{
      if(this.getAllAuditLogsResource.hasValue()){
        this.allAuditLogs.set(this.getAllAuditLogsResource.value())
      }
    });
  }

  authService = inject(AuthService);
  ticketService = inject(TicketService);
  userService = inject(UserService);
  auditLogService = inject(AuditLogService);
  navigationService = inject(NavigationService);

  currentUser = this.authService.getUserFromToken();
  allTickets = signal<TicketWithCreatedByRelationEntity[]>([]);
  allUsers = signal<UserEntity[]>([]);
  allAuditLogs = signal<AuditLogEntity[]>([])


  getAllTicketsRxResource = rxResource({
    stream:()=> this.ticketService.getAllTickets()
  });

  getAllUsersRxResource = rxResource({
    stream:()=> this.userService.getAll()
  });

  getAllAuditLogsResource = rxResource({
    stream:()=> this.auditLogService.getAll()
  });

  getTimeAgo(date: string): string{
    return UtilsClass.getTimeAgo(date);
  }

  goToUsersManagement(){
    this.navigationService.goToUsersManagement();
  }

}
