export interface TicketDiagnosisResponse {
  difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  possibleCauses: string[];
  diagnosticSteps: string[];
  recommendedSolutions: string[];
}
