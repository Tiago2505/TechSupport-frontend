import { UserRole } from "../enums";

export interface UserEntity {
  id:        number;
  fullname:  string;
  email:     string;
  phone:     string;
  role:      UserRole;
  isActive:  boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

