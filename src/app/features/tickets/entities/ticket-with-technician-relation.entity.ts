import { UserEntity } from "@features/users/entities";
import { TicketEntity } from "./ticket.entity";

export interface TicketWithTechnicianRelationEntity extends TicketEntity {
  technician: UserEntity | null;
}
