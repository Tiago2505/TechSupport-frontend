import { UserRole } from "../enums";


export interface UpdateUserDto{
  fullname: string;
  phone: string;
  isActive: boolean;
  role: UserRole;
}
