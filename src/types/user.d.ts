import { Document } from "mongoose";

export interface UserType {
  email: string;
  password?: string;
}

export interface UserTypeDocument extends UserType, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}
