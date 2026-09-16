import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AuditLogEntity } from '../../entities';
import { AuditLogService } from '@features/auditLogs/services/auditLog.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'audit-log-management',
  imports: [DatePipe],
  templateUrl: './audit-log-management.html',
})
export class AuditLogManagement {
  constructor() {
    effect(() => {
      if (this.auditLogsRxResource.hasValue()) {
        this.auditLogs.set(this.auditLogsRxResource.value());
      }
    });
  }

  auditLogService = inject(AuditLogService);

  auditLogs = signal<AuditLogEntity[]>([]);

  auditLogsRxResource = rxResource({
    stream: () => {
      return this.auditLogService.getAll();
    },
  });
}
