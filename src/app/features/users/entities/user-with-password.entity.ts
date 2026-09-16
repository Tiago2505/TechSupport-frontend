import { UserRole } from "../enums";
import { UserEntity } from "./user.entity";

export interface UserWithPasswordEntity extends UserEntity {

  password: string;

}

