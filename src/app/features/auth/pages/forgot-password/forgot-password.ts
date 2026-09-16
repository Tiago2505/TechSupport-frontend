import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@features/auth/services/auth.service';
import { HandleError } from '@shared/helpers';
import { NavigationService } from '@shared/services/navigation.service';
import { StorageService } from '@shared/services/storage.service';
import { EMPTY } from 'rxjs';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { IsLoading } from '@shared/components/is-loading/is-loading';
import { ErrorMessage } from "@shared/components/error-message/error-message";
import { ForgotPasswordHeader } from "./forgot-password-header/forgot-password-header";
import { EmailIcon } from "@features/auth/shared/components/email-icon/email-icon";

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, SuccessMessage, IsLoading, ErrorMessage, ForgotPasswordHeader, EmailIcon],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  constructor() {
    effect(() => {
      if (this.forgotPasswordRxResource.hasValue()) {
        this.goToVerifyPasswordResetCode();
      }
    });
  }

  navigationService = inject(NavigationService);
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  storageService = inject(StorageService);

  email = signal<string | null>(null);
  codeWasSent = signal<boolean>(false);
  sendCodeButtonPressed = signal<boolean>(false);

  forgotPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  forgotPasswordRxResource = rxResource({
    params: () => ({ email: this.email() }),
    stream: ({ params }) => {
      if (!params.email) return EMPTY;

      return this.authService.forgotPassword(params.email);
    },
  });

  sendCodeButton() {
    if (this.forgotPasswordForm.invalid) return this.forgotPasswordForm.markAllAsTouched();

    this.email.set(this.forgotPasswordForm.get('email')?.value);

    this.storageService.saveToSessionStorage('email', this.email()!);

    this.sendCodeButtonPressedTimeout();
  }

  getErrorMessage(formControl: AbstractControl, fieldName: string): string {
    return HandleError.getErrorMessage(formControl, fieldName);
  }

  goToLogin() {
    this.navigationService.goToLogin();
  }

  goToVerifyPasswordResetCode() {
    this.codeWasSent.set(true);
    setTimeout(() => {
      this.codeWasSent.set(false);
      this.navigationService.goToVerifYPasswordResetCode();
    }, 2000);
  }

  sendCodeButtonPressedTimeout() {
    this.sendCodeButtonPressed.set(true);

    setTimeout(() => {
      this.sendCodeButtonPressed.set(false);
    }, 2000);
  }
}
