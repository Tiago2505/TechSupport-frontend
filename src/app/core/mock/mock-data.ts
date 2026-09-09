import { UserRole } from '../models/user.model';

/**
 * Ticket lifecycle. The PRD (§20) names these states in English
 * (PENDING, IN_PROGRESS, WAITING_USER, RESOLVED, CLOSED); the app keeps the
 * Spanish domain wording and maps to it through {@link TICKET_STATUS_LABELS}.
 */
export type TicketStatus =
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'EN_ESPERA_USUARIO'
  | 'RESUELTO'
  | 'CERRADO';
export type TicketPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  EN_ESPERA_USUARIO: 'En espera del usuario',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
};

/** Gesture (advance) types a technician can log — PRD §13. */
export type GestureType = 'DIAGNOSIS' | 'REPAIR' | 'TEST' | 'COMMENT' | 'SOLUTION';

export const GESTURE_TYPES: GestureType[] = ['DIAGNOSIS', 'REPAIR', 'TEST', 'COMMENT', 'SOLUTION'];

export const GESTURE_TYPE_LABELS: Record<GestureType, string> = {
  DIAGNOSIS: 'Diagnóstico',
  REPAIR: 'Reparación',
  TEST: 'Prueba',
  COMMENT: 'Comentario',
  SOLUTION: 'Solución',
};

export interface Gesture {
  id: string;
  ticketId: string;
  type: GestureType;
  description: string;
  author: string;
  /** ISO date-time; the history stack is ordered by this field. */
  createdAt: string;
}

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
  { id: 'TS-1013', subject: 'Solicitud de segundo monitor', category: 'Hardware', status: 'RESUELTO', priority: 'BAJA', requester: 'Lucía Fernández', assignee: 'Elena Prado', createdAt: '2026-08-28T10:00:00Z' },
  { id: 'TS-1014', subject: 'Acceso a la carpeta compartida de Marketing', category: 'Redes', status: 'CERRADO', priority: 'MEDIA', requester: 'Lucía Fernández', assignee: 'Diego Ramírez', createdAt: '2026-08-20T09:30:00Z' },
  { id: 'TS-1015', subject: 'Cambio de teclado y ratón', category: 'Hardware', status: 'CERRADO', priority: 'BAJA', requester: 'Lucía Fernández', assignee: 'Elena Prado', createdAt: '2026-08-15T14:00:00Z' },
  { id: 'TS-1016', subject: 'Microsoft Teams se cierra solo', category: 'Software', status: 'PENDIENTE', priority: 'MEDIA', requester: 'Lucía Fernández', assignee: null, createdAt: '2026-09-02T08:45:00Z' },
];

/**
 * Seed history of gestures per ticket, in chronological order (oldest first).
 * The management view renders them as a LIFO stack (newest on top).
 */
export const MOCK_GESTURES: Gesture[] = [
  { id: 'g-1', ticketId: 'TS-1005', type: 'DIAGNOSIS', description: 'Se revisa el perfil de Outlook y el estado del buzón en el servidor de correo.', author: 'Diego Ramírez', createdAt: '2026-09-01T11:00:00Z' },
  { id: 'g-2', ticketId: 'TS-1005', type: 'REPAIR', description: 'Se recrea el perfil de Outlook y se reconfigura la cuenta de Exchange.', author: 'Diego Ramírez', createdAt: '2026-09-01T11:45:00Z' },
  { id: 'g-3', ticketId: 'TS-1005', type: 'TEST', description: 'Se envían y reciben correos de prueba: la sincronización completa aunque con retraso.', author: 'Diego Ramírez', createdAt: '2026-09-01T12:30:00Z' },
  { id: 'g-4', ticketId: 'TS-1006', type: 'DIAGNOSIS', description: 'Pantallazo azul recurrente con código MEMORY_MANAGEMENT al iniciar sesión.', author: 'Elena Prado', createdAt: '2026-09-01T11:40:00Z' },
  { id: 'g-5', ticketId: 'TS-1006', type: 'REPAIR', description: 'Se ejecuta el diagnóstico de memoria de Windows y se reasienta el módulo RAM del slot 2.', author: 'Elena Prado', createdAt: '2026-09-01T12:10:00Z' },
  { id: 'g-6', ticketId: 'TS-1012', type: 'DIAGNOSIS', description: 'La app móvil falla al solicitar los reportes: el gateway responde 504 Gateway Timeout.', author: 'Elena Prado', createdAt: '2026-09-01T13:20:00Z' },
  { id: 'g-7', ticketId: 'TS-1012', type: 'COMMENT', description: 'Se escala al equipo de backend para revisar el tiempo de respuesta del servicio de reportes.', author: 'Elena Prado', createdAt: '2026-09-01T13:55:00Z' },
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

/** Tickets reported by a given person, most recent first. */
export function ticketsByRequester(requester: string, source: Ticket[] = MOCK_TICKETS): Ticket[] {
  return [...source]
    .filter((ticket) => ticket.requester === requester)
    .sort(byCreatedAt)
    .reverse();
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
    return MOCK_TICKETS.filter(
      (ticket) => ticket.status === 'PENDIENTE' || ticket.status === 'EN_PROCESO',
    ).length;
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
