import { Component, effect, inject, signal } from '@angular/core';
import { ShowPassword } from '@features/auth/shared/components/show-password/show-password';
import { PasswordIcon } from '@features/auth/shared/components/password-icon/password-icon';
import { AuthService } from '@features/auth/services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY, timeout } from 'rxjs';
import { ChangePasswordDto } from '@features/auth/dtos';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { HandleError } from '@shared/helpers';
import { REGEX } from '@features/auth/regex';
import { NavigationService } from '@shared/services/navigation.service';

@Component({
  selector: 'app-change-password',
  imports: [ShowPassword, PasswordIcon, SuccessMessage, ErrorMessage, ReactiveFormsModule],
  templateUrl: './change-password.html',
})
export class ChangePassword {
  constructor() {
    effect(() => {
      if (this.changePasswordRxResource.hasValue() && this.changePasswordButtonPressed()) {
        this.message.set(
          'Your password has been updated successfully. You can now use your new password to sign in.',
        );

        this.passwordWasChanged.set(true);

        this.showMessageTimeout();

        setTimeout(() => {
          this.navigationService.goToHome();
        }, 2000);

        return;
      }

      if (this.changePasswordRxResource.error() && this.changePasswordButtonPressed()) {
        this.message.set(
          "We couldn't change your password. Please review the information entered and try again.",
        );

        return this.showMessageTimeout();
      }
    });
  }

  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  navigationService = inject(NavigationService);

  changePasswordDto = signal<ChangePasswordDto | null>(null);
  passwordWasChanged = signal<boolean>(false);
  message = signal<string>('');
  showMessage = signal<boolean>(false);
  changePasswordButtonPressed = signal<boolean>(false);
  showPassword = signal({
    current: false,
    new: false,
    confirm: false,
  });

  changePasswordForm: FormGroup = this.formBuilder.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.pattern(REGEX.PASSWORD)]],
    confirmPassword: ['', [Validators.required]],
  });

  changePasswordRxResource = rxResource({
    params: () => ({ changePasswordDto: this.changePasswordDto() }),
    stream: ({ params }) => {
      if (!params.changePasswordDto) return EMPTY;

      return this.authService.changePassword(params.changePasswordDto);
    },
  });

  setPasswordVisibility(field: string, value: boolean) {
    this.showPassword.update((passwords) => ({
      ...passwords,
      [field]: value,
    }));
  }

  changePasswordButton() {
    if (this.changePasswordForm.invalid) {
      return this.changePasswordForm.markAllAsTouched();
    }

    const newChangePasswordDto: ChangePasswordDto = {
      currentPassword: this.changePasswordForm.get('currentPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value,
      confirmPassword: this.changePasswordForm.get('confirmPassword')?.value,
    };

    if (newChangePasswordDto.currentPassword === newChangePasswordDto.newPassword) {
      this.message.set('The new password must be different from your current password.');

      return this.showMessageTimeout();
    }

    if (newChangePasswordDto.newPassword !== newChangePasswordDto.confirmPassword) {
      this.message.set('The new password and confirmation password do not match.');

      return this.showMessageTimeout();
    }


    this.changePasswordButtonPressedTimeout();
    this.changePasswordDto.set(newChangePasswordDto);
  }

  getErrorMessage(formControl: AbstractControl, fieldName: string): string {
    return HandleError.getErrorMessage(formControl, fieldName);
  }


  showMessageTimeout() {
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);
    }, 2000);
  }

  changePasswordButtonPressedTimeout(){
    this.changePasswordButtonPressed.set(true);
    setTimeout(() => {
      this.changePasswordButtonPressed.set(false);
    }, 2000);
  }
}
