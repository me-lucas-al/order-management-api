import bcrypt from "bcrypt"
import type { UserType, UserTypeDocument } from "../types/user";
import mongoose, { Schema, Model } from "mongoose";
import{ hashPasswordMiddleware } from "../middleware/auth-middleware";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", hashPasswordMiddleware);

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password as string);
};

const User = mongoose.model<UserTypeDocument>("User", userSchema);
export default User;
