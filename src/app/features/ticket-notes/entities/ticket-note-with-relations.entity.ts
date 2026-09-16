import { UserEntity } from "@features/users/entities";

export interface TicketNoteWithRelationsEntity {
  id:        number;
  content:   string;
  ticketId:  number;
  user:      UserEntity;
  createdBy: number;
  createdAt: string;
  deletedAt: string | null;
}



