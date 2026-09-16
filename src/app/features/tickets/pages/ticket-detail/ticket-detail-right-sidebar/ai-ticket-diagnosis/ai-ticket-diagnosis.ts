import { Component, effect, input } from '@angular/core';
import { TicketDiagnosisResponse } from '@features/tickets/dtos';
import { NoAiDiagnosis } from './no-ai-diagnosis/no-ai-diagnosis';

@Component({
  selector: 'ai-ticket-diagnosis',
  imports: [NoAiDiagnosis],
  templateUrl: './ai-ticket-diagnosis.html',
})
export class AiTicketDiagnosis {

  diagnosis = input.required<TicketDiagnosisResponse | null>();
}
