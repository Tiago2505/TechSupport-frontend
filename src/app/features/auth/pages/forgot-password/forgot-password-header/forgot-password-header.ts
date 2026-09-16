import { Component } from '@angular/core';
import { EmailIconHeader } from "./email-icon-header/email-icon-header";

@Component({
  selector: 'forgot-password-header',
  imports: [EmailIconHeader],
  templateUrl: './forgot-password-header.html',
})
export class ForgotPasswordHeader {}
