import { UserRole } from '../models/user.model';

export type TicketStatus = 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO';
export type TicketPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  requester: string;
  assignee: string | null;
  /** ISO date-time; the queue is ordered by this field (FIFO). */
  createdAt: string;
}

export interface DirectoryUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export const MOCK_CATEGORIES = ['Hardware', 'Software', 'Redes', 'Cuentas', 'Correo'];

export const MOCK_TICKETS: Ticket[] = [
  { id: 'TS-1001', subject: 'No enciende la laptop', category: 'Hardware', status: 'PENDIENTE', priority: 'ALTA', requester: 'Lucía Fernández', assignee: null, createdAt: '2026-09-01T08:12:00Z' },
  { id: 'TS-1002', subject: 'Error 500 en el portal de facturación', category: 'Software', status: 'PENDIENTE', priority: 'CRITICA', requester: 'Pedro Salas', assignee: null, createdAt: '2026-09-01T09:03:00Z' },
  { id: 'TS-1003', subject: 'Sin acceso a la VPN', category: 'Redes', status: 'PENDIENTE', priority: 'MEDIA', requester: 'Ana Torres', assignee: null, createdAt: '2026-09-01T09:41:00Z' },
  { id: 'TS-1004', subject: 'Restablecer contraseña de correo', category: 'Cuentas', status: 'EN_PROCESO', priority: 'BAJA', requester: 'Lucía Fernández', assignee: 'Diego Ramírez', createdAt: '2026-09-01T10:05:00Z' },
  { id: 'TS-1005', subject: 'Outlook no sincroniza', category: 'Correo', status: 'EN_PROCESO', priority: 'MEDIA', requester: 'Javier Núñez', assignee: 'Diego Ramírez', createdAt: '2026-09-01T10:52:00Z' },
  { id: 'TS-1006', subject: 'Pantalla azul al iniciar sesión', category: 'Hardware', status: 'EN_PROCESO', priority: 'ALTA', requester: 'Sofía Castro', assignee: 'Elena Prado', createdAt: '2026-09-01T11:20:00Z' },
  { id: 'TS-1007', subject: 'Instalación de licencia de diseño', category: 'Software', status: 'RESUELTO', priority: 'BAJA', requester: 'Marcos Rivas', assignee: 'Diego Ramírez', createdAt: '2026-08-30T14:10:00Z' },
  { id: 'TS-1008', subject: 'Impresora de planta sin red', category: 'Redes', status: 'RESUELTO', priority: 'MEDIA', requester: 'Carla Méndez', assignee: 'Elena Prado', createdAt: '2026-08-30T15:35:00Z' },
  { id: 'TS-1009', subject: 'Alta de usuario nuevo en el CRM', category: 'Cuentas', status: 'RESUELTO', priority: 'BAJA', requester: 'Pedro Salas', assignee: 'Diego Ramírez', createdAt: '2026-08-29T16:00:00Z' },
  { id: 'TS-1010', subject: 'Correo marcado como spam masivamente', category: 'Correo', status: 'PENDIENTE', priority: 'ALTA', requester: 'Ana Torres', assignee: null, createdAt: '2026-09-01T12:15:00Z' },
  { id: 'TS-1011', subject: 'Teclado con teclas repetidas', category: 'Hardware', status: 'PENDIENTE', priority: 'BAJA', requester: 'Javier Núñez', assignee: null, createdAt: '2026-09-01T12:48:00Z' },
  { id: 'TS-1012', subject: 'App móvil no carga reportes', category: 'Software', status: 'EN_PROCESO', priority: 'MEDIA', requester: 'Sofía Castro', assignee: 'Elena Prado', createdAt: '2026-09-01T13:05:00Z' },
];

export const MOCK_USERS: DirectoryUser[] = [
  { id: 'u-1', fullName: 'Lucía Fernández', email: 'cliente@techsupport.dev', role: 'USER', active: true },
  { id: 'u-2', fullName: 'Pedro Salas', email: 'pedro.salas@empresa.com', role: 'USER', active: true },
  { id: 'u-3', fullName: 'Ana Torres', email: 'ana.torres@empresa.com', role: 'USER', active: false },
  { id: 'u-4', fullName: 'Diego Ramírez', email: 'tecnico@techsupport.dev', role: 'TECHNICIAN', active: true },
  { id: 'u-5', fullName: 'Elena Prado', email: 'elena.prado@techsupport.dev', role: 'TECHNICIAN', active: true },
  { id: 'u-6', fullName: 'Marta Ochoa', email: 'admin@techsupport.dev', role: 'ADMIN', active: true },
];

export interface Distribution<T extends string = string> {
  label: T;
  count: number;
}

const byCreatedAt = (a: Ticket, b: Ticket) =>
  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

export function ticketsByStatus(status: TicketStatus, source: Ticket[] = MOCK_TICKETS): Ticket[] {
  return source.filter((ticket) => ticket.status === status);
}

/** Pending tickets ordered by arrival time — the technician FIFO queue. */
export function fifoQueue(source: Ticket[] = MOCK_TICKETS): Ticket[] {
  return ticketsByStatus('PENDIENTE', source).sort(byCreatedAt);
}

export function recentTickets(limit = 5, source: Ticket[] = MOCK_TICKETS): Ticket[] {
  return [...source].sort(byCreatedAt).reverse().slice(0, limit);
}

export function countBy<K extends string>(keyFn: (ticket: Ticket) => K, source: Ticket[] = MOCK_TICKETS): Distribution<K>[] {
  const totals = new Map<K, number>();
  for (const ticket of source) {
    const key = keyFn(ticket);
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }
  return [...totals.entries()].map(([label, count]) => ({ label, count }));
}

export const MOCK_ADMIN_METRICS = {
  get totalTickets() {
    return MOCK_TICKETS.length;
  },
  get activeUsers() {
    return MOCK_USERS.filter((user) => user.active).length;
  },
  get openTickets() {
    return MOCK_TICKETS.filter((ticket) => ticket.status !== 'RESUELTO').length;
  },
  get resolvedTickets() {
    return ticketsByStatus('RESUELTO').length;
  },
  get byCategory(): Distribution[] {
    return countBy((ticket) => ticket.category);
  },
  get byPriority(): Distribution<TicketPriority>[] {
    return countBy((ticket) => ticket.priority);
  },
};
