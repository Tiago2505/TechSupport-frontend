import { Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from '@features/auth/services/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { HandleError } from '@shared/helpers';
import { AsyncPipe } from '@angular/common';
import { VerifyPasswordResetCodeDto } from '@features/auth/dtos';
import { StorageService } from '@shared/services/storage.service';
import { NavigationService } from '@shared/services/navigation.service';
import { SuccessMessage } from "@shared/components/success-message/success-message";
import { ErrorMessage } from "@shared/components/error-message/error-message";
import { IsLoading } from "@shared/components/is-loading/is-loading";
import { VerifyPasswordResetCodeHeader } from "./verify-password-reset-code-header/verify-password-reset-code-header";

@Component({
  selector: 'verify-password-reset-code',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, AsyncPipe, SuccessMessage, ErrorMessage, IsLoading, VerifyPasswordResetCodeHeader],
  templateUrl: './verify-password-reset-code.html',
})
export class VerifyPasswordResetCode {

  constructor(){
    effect(()=>{
      if(this.verifyPasswordResetCodeRxResource.hasValue()){
        this.isCodeVerifiedTimeout();
      }

      if(this.resendCodeRxResource.hasValue()){
        this.isCodeResentTimeout();
        location.reload();
      }
    })
  }


  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  storageService = inject(StorageService);
  navigationService = inject(NavigationService);

  timer = this.authService.getPasswordResetTimer();

  email = computed(() => {
    return this.userPayload?.email;
  });

  resendCode = signal<boolean>(false);
  verifyPasswordResetCodeDto = signal<VerifyPasswordResetCodeDto | null>(null);
  isCodeVerified = signal<boolean>(false);
  isCodeResent = signal<boolean>(false);
  verifyCodeButtonPressed = signal<boolean>(false);


  userPayload = this.authService.getUserFromToken();

  resendCodeRxResource = rxResource({
    params: () => ({
      resend: this.resendCode(),
      email: this.email(),
    }),

    stream: ({ params }) => {
      if (!params.resend) {
        return EMPTY;
      }

      if(!params.email){
        this.navigationService.gotToForgotPassword();
        return EMPTY;
      }

      return this.authService.forgotPassword(params.email);
    },
  });

  verifyPasswordResetCodeRxResource = rxResource({
    params: () => ({ verifyPasswordResetCodeDto: this.verifyPasswordResetCodeDto() }),
    stream: ({ params }) => {
      if (!params.verifyPasswordResetCodeDto) return EMPTY;

      if (!params.verifyPasswordResetCodeDto.email) {
        this.navigationService.gotToForgotPassword();
        return EMPTY;
      }

      return this.authService.verifyPasswordResetCode(params.verifyPasswordResetCodeDto);
    },
  });

  verifyPasswordResetCodeForm: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  getErrorMessage(formControl: AbstractControl, fieldName: string): string {
    return HandleError.getErrorMessage(formControl, fieldName);
  }

  verifyCodebutton() {
    if (this.verifyPasswordResetCodeForm.invalid)
      return this.verifyPasswordResetCodeForm.markAllAsTouched();

    const newVerifyPasswordResetCodeDto: VerifyPasswordResetCodeDto = {
      code: this.verifyPasswordResetCodeForm.get('code')?.value,
      email: this.storageService.getItemFromSessionStorage('email')!,
    };

    this.verifyPasswordResetCodeDto.set(newVerifyPasswordResetCodeDto);


    this.verifyCodeButtonPressedTimeout();
  }

  resendCodeButton() {
    this.resendCode.set(true);
  }

  isCodeVerifiedTimeout(){
    this.isCodeVerified.set(true);
    setTimeout(() => {
      this.isCodeVerified.set(false);
      this.goToResetPassword();
    }, 2000);
  }

  verifyCodeButtonPressedTimeout(){
    this.verifyCodeButtonPressed.set(true);
    setTimeout(() => {
      this.verifyCodeButtonPressed.set(false);

    }, 2000);
  }

  isCodeResentTimeout(){
    this.isCodeResent.set(true);
    setTimeout(() => {
      this.isCodeResent.set(false);

    }, 2000);
  }

  goToResetPassword(){
    this.navigationService.goToResetPassword();
  }
}
