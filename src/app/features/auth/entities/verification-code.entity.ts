export interface VerificationCodeEntity{
  id:        number;
  code:      string;
  createdAt: Date;
  expiresAt: Date;
  userId:    number;
  used:      boolean;
}
