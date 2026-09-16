export interface JwtPayload {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  iat: number;
  exp: number;
}
