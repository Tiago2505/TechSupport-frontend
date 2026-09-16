

export interface ResetPasswordDto{
  newPassword: string;
  confirmPassword: string;
  passwordResetToken: string;
  email: string;
}
