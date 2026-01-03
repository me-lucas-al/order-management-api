import bcrypt from "bcrypt"; 
import User from "../models/user";
import type { RegisterSchemaType } from "../schemas/register";
import type { LoginSchemaType } from "../schemas/login";
import { generateToken } from "../utils/jwt";

export class AuthService {
  async register(userData: RegisterSchemaType) {
    const existingUser = await User.findOne({ email: userData.email });
    
    if (existingUser) {
      throw new Error("Usuário já existente");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    return { user, token };
  }

  async login(credentials: LoginSchemaType) {
    const user = await User.findOne({ email: credentials.email }).select("+password");

    if (!user) {
      throw new Error("Credenciais Inválidas");
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

    if (!isPasswordValid) {
      throw new Error("Credenciais Inválidas");
    }

    const token = generateToken(user._id.toString());

    return { user, token };
  }
}