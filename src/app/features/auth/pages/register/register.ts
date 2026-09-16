import { Component, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordIcon } from '@features/auth/shared/components/password-icon/password-icon';
import { ShowPassword } from '@features/auth/shared/components/show-password/show-password';
import { EmailIcon } from '@features/auth/shared/components/email-icon/email-icon';
import { LeftPanelRegister } from './left-panel-register/left-panel-register';
import { PhoneIcon } from './left-panel-register/phone-icon/phone-icon';
import { UserIconRegister } from './user-icon-register/user-icon-register';
import { AuthService } from '@features/auth/services/auth.service';
import { NavigationService } from '@shared/services/navigation.service';
import { REGEX } from '@features/auth/regex';
import { rxResource } from '@angular/core/rxjs-interop';
import { RegisterDto } from '@features/auth/dtos';
import { EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SuccessMessage } from '@shared/components/success-message/success-message';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { HandleError } from '@shared/helpers';
@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    PasswordIcon,
    ShowPassword,
    EmailIcon,
    LeftPanelRegister,
    PhoneIcon,
    UserIconRegister,
    SuccessMessage,
    ErrorMessage,
  ],
  templateUrl: './register.html',
})
export class Register {
  constructor() {
    effect(() => {
      if (this.registerRxResource.hasValue()) {
        this.message.set('Your account has been created successfully.');
        this.registerSuccessTimeout();
        return;
      }

      const error = this.registerRxResource.error();

      if (!error || !this.registerButtonPressed()) {
        return;
      }

      const httpError = (error as any).cause;

      switch (httpError?.status) {
        case 409:
          this.message.set('An account with this email address already exists.');
          break;

        default:
          this.message.set('We couldn’t create your account. Please try again.');
      }
    });
  }

  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  navigationService = inject(NavigationService);

  registerDto = signal<RegisterDto | null>(null);
  message = signal<string>('');
  registerSuccess = signal<boolean>(false);
  registerButtonPressed = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  registerForm: FormGroup = this.formBuilder.group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(REGEX.PHONE)]],
    password: ['', [Validators.required, Validators.pattern(REGEX.PASSWORD)]],
  });

  registerRxResource = rxResource({
    params: () => ({ registerDto: this.registerDto() }),
    stream: ({ params }) => {
      if (!params.registerDto) return EMPTY;

      return this.authService.register(params.registerDto);
    },
  });

  registerButton() {
    if (this.registerForm.invalid) return this.registerForm.markAllAsTouched();

    const newRegisterDto: RegisterDto = {
      fullname: this.registerForm.get('fullname')?.value,
      phone: this.registerForm.get('phone')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
    };

    this.registerDto.set(newRegisterDto);

    this.registerButtonPressedTimeout();
  }

  getErrorMessage(formControl: AbstractControl, fieldName: string): string {
    return HandleError.getErrorMessage(formControl, fieldName);
  }

  registerSuccessTimeout() {
    this.registerSuccess.set(true);
    setTimeout(() => {
      this.registerSuccess.set(false);
    }, 2000);
  }

  registerButtonPressedTimeout() {
    this.registerButtonPressed.set(true);
    setTimeout(() => {
      this.registerButtonPressed.set(false);
    }, 2000);
  }

  goToLogin() {
    this.navigationService.goToLogin();
  }
}
