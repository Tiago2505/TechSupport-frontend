import { Injectable } from '@angular/core';

import {
  Gesture,
  GESTURE_TYPE_LABELS,
  Ticket,
  TICKET_STATUS_LABELS,
} from '../../core/mock/mock-data';

const asFragment = (text: string): string => {
  const clean = text.trim().replace(/[.\s]+$/, '');
  return clean.charAt(0).toLowerCase() + clean.slice(1);
};

/**
 * Simulated AI assistant for technicians (PRD §13). Reads the LIFO history
 * stack of a ticket and produces a short narrative summary of the case.
 */
@Injectable({ providedIn: 'root' })
export class AiSummaryService {
  /**
   * @param ticket the ticket being managed
   * @param history gestures ordered newest-first (as shown in the stack)
   */
  summarize(ticket: Ticket, history: Gesture[]): string {
    const statusLabel = TICKET_STATUS_LABELS[ticket.status];

    if (history.length === 0) {
      return (
        `El ticket ${ticket.id} ("${ticket.subject}"), reportado por ${ticket.requester}, ` +
        `todavía no tiene gestiones registradas. Estado actual: ${statusLabel}.`
      );
    }

    const chronological = [...history].reverse();
    const counts = new Map<Gesture['type'], number>();
    for (const gesture of chronological) {
      counts.set(gesture.type, (counts.get(gesture.type) ?? 0) + 1);
    }

    const first = chronological[0];
    const last = chronological[chronological.length - 1];
    const diagnosis = chronological.find((gesture) => gesture.type === 'DIAGNOSIS');
    const solution = [...chronological].reverse().find((gesture) => gesture.type === 'SOLUTION');

    const total = chronological.length;
    const breakdown = [...counts.entries()]
      .map(([type, count]) => `${count} de ${GESTURE_TYPE_LABELS[type].toLowerCase()}`)
      .join(', ');

    const sentences = [
      `El caso ${ticket.id} ("${ticket.subject}"), reportado por ${ticket.requester}, ` +
        `acumula ${total} ${total === 1 ? 'gestión' : 'gestiones'} y se encuentra en estado "${statusLabel}".`,
      diagnosis
        ? `El diagnóstico realizado por ${diagnosis.author} señala que ${asFragment(diagnosis.description)}.`
        : `La primera gestión (${GESTURE_TYPE_LABELS[first.type].toLowerCase()}) fue: ${asFragment(first.description)}.`,
      `A lo largo del caso se registraron ${breakdown}.`,
      solution
        ? `Solución aplicada: ${asFragment(solution.description)}.`
        : `La última acción, a cargo de ${last.author}, fue ${GESTURE_TYPE_LABELS[last.type].toLowerCase()}: ${asFragment(last.description)}.`,
      ticket.status === 'RESUELTO' || ticket.status === 'CERRADO'
        ? 'El ticket no requiere más intervención.'
        : 'El ticket sigue abierto y necesita seguimiento del técnico asignado.',
    ];

    return sentences.join(' ');
  }
}
