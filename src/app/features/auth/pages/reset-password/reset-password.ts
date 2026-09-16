import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResetPasswordDto } from '@features/auth/dtos';
import { REGEX } from '@features/auth/regex';
import { AuthService } from '@features/auth/services/auth.service';
import { NavigationService } from '@shared/services/navigation.service';
import { StorageService } from '@shared/services/storage.service';
import { EMPTY } from 'rxjs';
import { SuccessMessage } from "@shared/components/success-message/success-message";
import { ErrorMessage } from "@shared/components/error-message/error-message";
import { IsLoading } from "@shared/components/is-loading/is-loading";
import { ShowPassword } from "@features/auth/shared/components/show-password/show-password";
import { PasswordIcon } from "@features/auth/shared/components/password-icon/password-icon";
import { HandleError } from '@shared/helpers';
import { ResetPasswordHeader } from "./reset-password-header/reset-password-header";
import { ResetPasswordRequirements } from "./reset-password-requirements/reset-password-requirements";

@Component({
  selector: 'app-reset-password',
  imports: [SuccessMessage, ErrorMessage, IsLoading, ReactiveFormsModule, ShowPassword, PasswordIcon, ResetPasswordHeader, ResetPasswordRequirements],
  templateUrl: './reset-password.html',
})
export class ResetPassword {

  constructor(){
    effect(()=>{
      if(this.resetPasswordRxResource.hasValue()){
        this.passwordWasResetTimeout();
      }
    })
  }

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  storageService = inject(StorageService);
  navigationService = inject(NavigationService);

  resetPasswordDto = signal<ResetPasswordDto | null>(null);
  passwordWasReset = signal<boolean>(false);
  passwordResetButtonPressed = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  resetPasswordForm: FormGroup = this.formBuilder.group({
    newPassword: ['', [Validators.required, Validators.pattern(REGEX.PASSWORD)]],
    confirmPassword: ['', Validators.required]
  });

  resetPasswordRxResource = rxResource({
    params: ()=>({resetPasswordDto: this.resetPasswordDto()}),
    stream: ({params})=>{
      if(!params.resetPasswordDto) return EMPTY;

      if(!params.resetPasswordDto.email || !params.resetPasswordDto.passwordResetToken) {
        this.navigationService.gotToForgotPassword();
        return EMPTY;
      }

      return this.authService.resetPassword(params.resetPasswordDto);
    }
  });

  getErrorMessage(formControl: AbstractControl, fieldName: string): string{
    return HandleError.getErrorMessage(formControl, fieldName)
  }

  resetPasswordButton(){
    if(this.resetPasswordForm.invalid) return this.resetPasswordForm.markAllAsTouched();

    const newResetPasswordDto: ResetPasswordDto = {
      newPassword: this.resetPasswordForm.get('newPassword')?.value,
      confirmPassword: this.resetPasswordForm.get('confirmPassword')?.value,
      passwordResetToken: this.storageService.getItemFromSessionStorage('passwordResetToken')!,
      email: this.storageService.getItemFromSessionStorage('email')!,
    }

    this.resetPasswordDto.set(newResetPasswordDto);

    this.passwordResetButtonPressedTimeout();

  }


  passwordWasResetTimeout(){
    this.passwordWasReset.set(true);
    setTimeout(() => {
      this.passwordWasReset.set(false);
      this.goToLogin();
    }, 2000);
  }

  passwordResetButtonPressedTimeout(){
    this.passwordResetButtonPressed.set(true);
    setTimeout(() => {
        this.passwordResetButtonPressed.set(false);
    }, 2000);
  }

  goToLogin(){
    this.navigationService.goToLogin();
  }

}
