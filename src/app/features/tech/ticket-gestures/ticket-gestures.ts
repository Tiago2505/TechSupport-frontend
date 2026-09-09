import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  GESTURE_TYPE_LABELS,
  GESTURE_TYPES,
  GestureType,
  TICKET_STATUS_LABELS,
  TicketStatus,
} from '../../../core/mock/mock-data';
import {
  TECH_STATUS_OPTIONS,
  TicketWorkflowService,
} from '../../../core/services/ticket-workflow.service';
import { AiSummaryService } from '../../../shared/services/ai-summary.service';

/**
 * Ticket management view (PRD §13). Shows the LIFO history stack of gestures
 * (newest on top), lets the technician push a new gesture, change the ticket
 * status and ask the AI assistant for a summary of the case.
 */
@Component({
  selector: 'app-ticket-gestures',
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-gestures.html',
  styleUrl: './ticket-gestures.css',
})
export class TicketGestures {
  private readonly route = inject(ActivatedRoute);
  private readonly workflow = inject(TicketWorkflowService);
  private readonly summarizer = inject(AiSummaryService);
  private readonly fb = inject(FormBuilder);

  protected readonly gestureTypes = GESTURE_TYPES;
  protected readonly gestureTypeLabels = GESTURE_TYPE_LABELS;
  protected readonly statusLabels = TICKET_STATUS_LABELS;
  protected readonly statusOptions = TECH_STATUS_OPTIONS;

  readonly ticketId = signal(this.route.snapshot.paramMap.get('id') ?? '');
  readonly ticket = computed(() => this.workflow.ticketById(this.ticketId()));
  readonly history = computed(() => this.workflow.gestureHistory(this.ticketId()));

  readonly summary = signal<string | null>(null);
  readonly summarizing = signal(false);

  readonly form = this.fb.nonNullable.group({
    type: ['DIAGNOSIS' as GestureType, Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected get description() {
    return this.form.controls.description;
  }

  addGesture(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { type, description } = this.form.getRawValue();
    this.workflow.addGesture(this.ticketId(), type, description);
    this.form.reset({ type, description: '' });
    this.summary.set(null);
  }

  changeStatus(status: TicketStatus): void {
    this.workflow.setStatus(this.ticketId(), status);
    this.summary.set(null);
  }

  summarize(): void {
    const ticket = this.ticket();
    if (!ticket) {
      return;
    }
    this.summarizing.set(true);
    this.summary.set(this.summarizer.summarize(ticket, this.history()));
    this.summarizing.set(false);
  }
}
