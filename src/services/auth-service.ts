import User from "../schemas/user";
import type { UserType } from "../types/user";
import { generateToken } from "../utils/jwt";

export class AuthService {
  async register(userData: UserType) {
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await User.create(userData);
    const token = generateToken(user._id.toString());

    return { user, token };
  }

  async login(credentials: UserType) {
    const user = await User.findOne({ email: credentials.email }).select("+password");

    if (!user || !(await user.comparePassword(credentials.password!))) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id.toString());

    return { user, token };
  }
}