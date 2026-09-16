import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { DatePipe } from '@angular/common';

import { REGEX } from '@features/auth/regex';
import { AuthService } from '@features/auth/services/auth.service';

import { UserService } from '@features/users/services/user.service';
import { UserWithPasswordEntity } from '@features/users/entities/user-with-password.entity';
import { UpdateUserDto } from '../../dtos/update-user.dto';

import { UpdateUserHeader } from './update-user-header/update-user-header';
import { UpdateUserFullnameIcon } from './update-user-fullname-icon/update-user-fullname-icon';
import { UpdateUserPhoneIcon } from './update-user-phone-icon/update-user-phone-icon';
import { UpdateUserAccountConfiguration } from './update-user-account-configuration/update-user-account-configuration';
import { UpdateUserAccountInformation } from './update-user-account-information/update-user-account-information';

import { PasswordIcon } from '@features/auth/shared/components/password-icon/password-icon';

import { SuccessMessage } from '@shared/components/success-message/success-message';
import { ErrorMessage } from '@shared/components/error-message/error-message';
import { NotFound } from '@shared/components/not-found/not-found';
import { ChangePasswordByAdminDto } from '@features/auth/dtos';
import { NavigationService } from '@shared/services/navigation.service';
import { IsLoading } from '@shared/components/is-loading/is-loading';

@Component({
  selector: 'app-update-users',
  imports: [
    UpdateUserHeader,
    UpdateUserFullnameIcon,
    UpdateUserPhoneIcon,
    UpdateUserAccountConfiguration,
    PasswordIcon,
    UpdateUserAccountInformation,
    DatePipe,
    ReactiveFormsModule,
    SuccessMessage,
    ErrorMessage,
    NotFound,
    IsLoading
],
  templateUrl: './update-users.html',
})
export class UpdateUsers {
  constructor() {
    effect(() => {
      if (this.getUserRxResource.hasValue()) {
        const user = this.getUserRxResource.value();

        this.userInformation.set(user);

        this.updateUserForm.patchValue({
          fullname: user!.fullname,
          phone: user!.phone,
          role: user!.role,
          isActive: user!.isActive ? 'true' : 'false',
          newPassword: '',
          confirmPassword: '',
        });
      }
    });

    effect(() => {
      if (this.updateUserRxResource.hasValue()) {
        this.userUpdated.set(true);
        this.showMessageTimeout();
        this.goToUsersManagement();
      }
    });

    effect(() => {
      if (this.updateUserPasswordRxResource.hasValue()) {
        this.passwordUpdated.set(true);
        this.showMessageTimeout();

        this.goToUsersManagement();
      }
    });

    effect(() => {
      if (this.updateUserRxResource.error() || this.updateUserPasswordRxResource.error()) {
        if (this.updateUserButtonPressed()) {
          this.userUpdated.set(false);
          this.passwordUpdated.set(false);
          this.showMessageTimeout();
        }
      }
    });
  }

  formBuilder = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  userService = inject(UserService);
  authService = inject(AuthService);
  navigationService = inject(NavigationService);

  userId = this.activatedRoute.snapshot.paramMap.get('id');

  userInformation = signal<UserWithPasswordEntity | null>(null);

  updateUserDto = signal<UpdateUserDto | null>(null);

  updatePasswordDto = signal<ChangePasswordByAdminDto | null>(null);

  showMessage = signal<boolean>(false);

  userUpdated = signal<boolean>(false);

  passwordUpdated = signal<boolean>(false);

  updateUserButtonPressed = signal<boolean>(false);

  updateUserForm: FormGroup = this.formBuilder.group({
    fullname: ['', Validators.required],

    phone: ['', [Validators.required, Validators.pattern(REGEX.PHONE)]],

    role: [null, Validators.required],

    isActive: [null, Validators.required],

    newPassword: [''],

    confirmPassword: [''],
  });


  getUserRxResource = rxResource({
    params: () => ({
      userId: this.userId,
    }),

    stream: ({ params }) => {
      if (!params.userId) {
        return EMPTY;
      }

      return this.userService.getUserByIdWithPassword(Number(params.userId));
    },
  });


  updateUserRxResource = rxResource({
    params: () => ({
      userId: this.userId,
      updateUserDto: this.updateUserDto(),
    }),

    stream: ({ params }) => {
      if (!params.userId || !params.updateUserDto) {
        return EMPTY;
      }

      return this.userService.update(Number(params.userId), params.updateUserDto);
    },
  });


  updateUserPasswordRxResource = rxResource({
    params: () => ({
      userId: this.userId,
      updatePasswordDto: this.updatePasswordDto(),
    }),

    stream: ({ params }) => {
      if (!params.userId || !params.updatePasswordDto) {
        return EMPTY;
      }

      return this.authService.updatePasswordByAdmin(
        Number(params.userId),
        params.updatePasswordDto,
      );
    },
  });

  updateUserButton() {
    if (this.updateUserForm.invalid) {
      this.updateUserForm.markAllAsTouched();
      return;
    }

    const newPassword = this.updateUserForm.get('newPassword')?.value?.trim();

    const confirmPassword = this.updateUserForm.get('confirmPassword')?.value?.trim();


    if ((newPassword && !confirmPassword) || (!newPassword && confirmPassword)) {
      this.userUpdated.set(false);
      this.passwordUpdated.set(false);
      this.showMessageTimeout();

      return;
    }


    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      this.userUpdated.set(false);
      this.passwordUpdated.set(false);
      this.showMessageTimeout();

      return;
    }


    const newUpdateUserDto: UpdateUserDto = {
      fullname: this.updateUserForm.get('fullname')?.value,

      phone: this.updateUserForm.get('phone')?.value,

      role: this.updateUserForm.get('role')?.value,

      isActive: this.updateUserForm.get('isActive')?.value === 'true',
    };


    this.userUpdated.set(false);
    this.passwordUpdated.set(false);
    this.showMessage.set(false);

    this.updateUserButtonPressed.set(true);


    this.updateUserDto.set(newUpdateUserDto);


    if (newPassword) {
      const newChangePasswordDto: ChangePasswordByAdminDto = {
        newPassword,
        confirmPassword,
      };

      this.updatePasswordDto.set(newChangePasswordDto);
    } else {

      this.updatePasswordDto.set(null);
    }
  }

  showMessageTimeout() {
    this.showMessage.set(true);

    setTimeout(() => {
      this.showMessage.set(false);
    }, 2000);
  }

  goToUsersManagement(){
    setTimeout(() => {
      this.navigationService.goToUsersManagement()
    }, 2000);
  }
}
