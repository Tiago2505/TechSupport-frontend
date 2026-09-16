export interface TicketNoteEntity {
  id:        number;
  content:   string;
  ticketId:  number;
  createdBy: number;
  createdAt: string | null;
  deletedAt: string | null;
}
