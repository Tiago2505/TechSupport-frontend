export type UserRole = 'USER' | 'TECHNICIAN' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

/** Shape returned by `POST /auth/login` on the NestJS backend. */
export interface AuthResponse {
  access_token: string;
  user: User;
}
