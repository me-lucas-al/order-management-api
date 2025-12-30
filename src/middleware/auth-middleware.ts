import bcrypt from "bcrypt";
import type { UserTypeDocument } from "../types/user";

export async function hashPasswordMiddleware(this: UserTypeDocument) {
  if (!this.isModified("password")) {
    return;
  }

  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
}