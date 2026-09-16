import { Component, input } from '@angular/core';

@Component({
  selector: 'verify-password-reset-code-header',
  imports: [],
  templateUrl: './verify-password-reset-code-header.html',
})
export class VerifyPasswordResetCodeHeader {
  email = input.required<string>();
}
