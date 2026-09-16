import { Component, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { ErrorMessage } from "@shared/components/error-message/error-message";
import { LeftPanel } from "./left-panel/left-panel";
import { RightPanelHeader } from './left-panel-header/right-panel-header';
import { ShowPassword } from '@features/auth/shared/components/show-password/show-password';
import { AuthService } from '@features/auth/services/auth.service';
import { HandleError } from '@shared/helpers';
import { PasswordIcon } from '@features/auth/shared/components/password-icon/password-icon';
import { EmailIcon } from '@features/auth/shared/components/email-icon/email-icon';
import { LoginDto } from '@features/auth/dtos';
import { NavigationService } from '@shared/services/navigation.service';
import { LoginRegisterLink } from './login-register-link/login-register-link';
import { IsLoading } from '@shared/components/is-loading/is-loading';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, SuccessMessage, ErrorMessage, LeftPanel, RightPanelHeader, EmailIcon, PasswordIcon, ShowPassword, LoginRegisterLink, IsLoading],
  templateUrl: './login.html',
})
export class Login {
  constructor() {
    effect(() => {
      if (this.loginRxResource.hasValue()) {
        this.loginSuccess.set(true);

        this.showMessageTimeout();
        this.goToHome();
      }else if( this.loginRxResource.error() && this.loginButtonPressed()){
        this.showMessageTimeout();
      }
    });
  }

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  navigationService = inject(NavigationService);

  loginDto = signal<LoginDto | null>(null);
  rememberMe = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showMessage = signal<boolean>(false);
  loginSuccess = signal<boolean>(false);
  loginButtonPressed = signal<boolean>(false);

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  loginRxResource = rxResource({
    params: () => ({ loginDto: this.loginDto(), rememberMe: this.rememberMe() }),
    stream: ({ params }) => {
      if (!params.loginDto) return EMPTY;

      return this.authService.login(params.loginDto, params.rememberMe);
    },
  });

  getErrorMessage(formControl: AbstractControl, fieldName: string): string {
    return HandleError.getErrorMessage(formControl, fieldName);
  }

  login() {
    if (this.loginForm.invalid) return this.loginForm.markAllAsTouched();

    const newLoginDto: LoginDto = {
      email: this.loginForm.get('email')!.value,
      password: this.loginForm.get('password')!.value,
    };

    this.loginDto.set(newLoginDto);
    this.rememberMe.set(this.loginForm.get('rememberMe')?.value);

    this.loginButtonPressed.set(true);

  }

  showMessageTimeout(){
    this.showMessage.set(true);
    setTimeout(() => {
      this.showMessage.set(false);
    }, 2000);
  }

  goToForgotPassword(){
    this.navigationService.gotToForgotPassword();
  }

  goToHome(){
    setTimeout(() => {
      this.navigationService.goToHome();
    }, 2000);
  }


}
