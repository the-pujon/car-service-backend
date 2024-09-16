import { Model } from "mongoose";

type TRole = "admin" | "user";

export interface TUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: TRole;
  address: string;
}

export interface UserStaticMethods extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>;
  isPasswordMatch(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export interface TUpdateUser {
  name?: string;
  phone?: string;
  address?: string;
}

export interface TUpdateUserRole {
  role: TRole;
}
