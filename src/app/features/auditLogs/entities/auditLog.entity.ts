import { UserEntity } from "@features/users/entities";
import { AuditAction, AuditEntity } from "../enums";


export interface AuditLogEntity {
  id:               number;
  action:           AuditAction;
  entity:           AuditEntity;
  performedById:    UserEntity;
  affectedRecordId: number;
  createdAt:        string;
}



