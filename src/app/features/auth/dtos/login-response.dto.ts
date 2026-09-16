import { UserEntity } from "@features/users/entities";

export interface LoginResponse {
  user:  UserEntity;
  token: string;
}
