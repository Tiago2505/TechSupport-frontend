import { UserEntity } from "@features/users/entities";
import { TicketEntity } from "./ticket.entity";

export interface TicketWithCreatedByRelationEntity extends TicketEntity {
  user: UserEntity | null;
}
