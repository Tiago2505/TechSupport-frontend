import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, interval, map, takeWhile } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ChangePasswordByAdminDto,
  ChangePasswordDto,
  LoginDto,
  LoginResponse,
  RegisterDto,
  ResetPasswordDto,
  VerifyPasswordResetCodeDto,
  VerifyPasswordResetCodeResponse,
} from '../dtos';
import { StorageService } from '@shared/services/storage.service';

import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../interfaces';
import { VerificationCodeEntity } from '../entities';
import { UserEntity } from '@features/users/entities';

@Injectable({ providedIn: 'root' })
export class AuthService {
  baseUrl = environment.BASE_URL;
  http = inject(HttpClient);
  storageService = inject(StorageService);

  private getPasswordResetExpiration(): number | null {
    const expiresAt = this.storageService.getItemFromSessionStorage('codeExpiresAt');

    if (!expiresAt) {
      return null;
    }

    return new Date(JSON.parse(expiresAt)).getTime();
  }

  getPasswordResetTimer(): Observable<string> {
    const expiresAt = this.getPasswordResetExpiration();

    if (!expiresAt) {
      return new Observable((subscriber) => {
        subscriber.next('00:00');
        subscriber.complete();
      });
    }

    return interval(1000).pipe(
      map(() => {
        const remaining = Math.max(expiresAt - Date.now(), 0);

        const totalSeconds = Math.floor(remaining / 1000);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }),
      takeWhile((time) => time !== '00:00', true),
    );
  }

  getUserFromToken(): JwtPayload | null {
    const token =
      this.storageService.getItemFromLocalStorage('token') ??
      this.storageService.getItemFromSessionStorage('token');

    if (!token) {
      return null;
    }

    return jwtDecode<JwtPayload>(token);
  }

  logout() {
    this.storageService.removeItemFromLocalStorage('token');
    this.storageService.removeItemFromSessionStorage('token');
  }

  login(loginDto: LoginDto, rememberMe: boolean): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, loginDto).pipe(
      tap((resp) => {
        if (rememberMe) {
          this.storageService.saveToLocalStorage('token', resp.token);
        } else {
          this.storageService.saveToSessionStorage('token', resp.token);
        }
      }),
    );
  }

  register(registerDto: RegisterDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/register`, registerDto);
  }

  forgotPassword(email: string): Observable<VerificationCodeEntity> {
    return this.http
      .post<VerificationCodeEntity>(`${this.baseUrl}/auth/forgot-password`, { email })
      .pipe(
        tap((resp) =>
          this.storageService.saveToSessionStorage('codeExpiresAt', JSON.stringify(resp.expiresAt)),
        ),
      );
  }

  verifyPasswordResetCode(
    verifyPasswordResetCode: VerifyPasswordResetCodeDto,
  ): Observable<VerifyPasswordResetCodeResponse> {
    return this.http
      .post<VerifyPasswordResetCodeResponse>(
        `${this.baseUrl}/auth/verify-code`,
        verifyPasswordResetCode,
      )
      .pipe(
        tap((resp) => {
          this.storageService.saveToSessionStorage('passwordResetToken', resp.passwordResetToken);
        }),
      );
  }

  resetPassword(resetPasswordDto: ResetPasswordDto): Observable<UserEntity> {
    return this.http.post<UserEntity>(`${this.baseUrl}/auth/reset-password`, resetPasswordDto).pipe(
      tap((resp) => {
        this.storageService.removeItemFromSessionStorage('passwordResetToken');
        this.storageService.removeItemFromSessionStorage('codeExpiresAt');
      }),
    );
  }

  changePassword(changePasswordDto: ChangePasswordDto): Observable<UserEntity> {
    return this.http.post<UserEntity>(`${this.baseUrl}/auth/change-password`, changePasswordDto);
  }

  updatePasswordByAdmin(
    id: number,
    changePasswordDto: ChangePasswordByAdminDto,
  ): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/auth/${id}/change-password`,
      changePasswordDto,
    );
  }
}
