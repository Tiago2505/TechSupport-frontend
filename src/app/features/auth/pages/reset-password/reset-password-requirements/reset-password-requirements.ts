import { Component } from '@angular/core';
import { CheckIconRequirements } from "./check-icon-requirements/check-icon-requirements";

@Component({
  selector: 'reset-password-requirements',
  imports: [CheckIconRequirements],
  templateUrl: './reset-password-requirements.html',
})
export class ResetPasswordRequirements {}
