import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MOCK_CATEGORIES } from '../../../core/mock/mock-data';

/**
 * New ticket form (PRD §15). Supports deep links from the AI assistant: the
 * `title` and `description` query params pre-fill the form so the client only
 * has to review and confirm.
 */
@Component({
  selector: 'app-new-ticket',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './new-ticket.html',
  styleUrl: './new-ticket.css',
})
export class NewTicket {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  protected readonly categories = MOCK_CATEGORIES;
  protected readonly priorities = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
  readonly submitted = signal(false);
  readonly prefilled = signal(false);

  readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    category: ['Hardware', [Validators.required]],
    priority: ['MEDIA', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    const title = params.get('title');
    const description = params.get('description');

    if (title || description) {
      this.form.patchValue({
        title: title ?? this.form.value.title,
        description: description ?? this.form.value.description,
      });
      this.prefilled.set(true);
    }
  }

  protected get title() {
    return this.form.get('title');
  }

  protected get description() {
    return this.form.get('description');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitted.set(true);
  }
}
