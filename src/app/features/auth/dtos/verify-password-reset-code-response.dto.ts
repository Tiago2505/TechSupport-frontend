import { VerificationCodeEntity } from "../entities";


export interface VerifyPasswordResetCodeResponse {
  code:               VerificationCodeEntity;
  passwordResetToken: string;
}
