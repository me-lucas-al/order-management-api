import type { Request, Response } from "express";
import { AuthService } from "../services/auth-service";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.register(req.body);

    const userResponse = user.toObject();
    return res.status(201).json({
      user: {
        _id: userResponse._id,
        email: userResponse.email,
      },
      token,
    });
  } catch (error: any) {
    console.error("Erro no Register:", error);

    if (error.message === "User already exists") {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.login(req.body);

    const userResponse = user.toObject();

    return res.status(200).json({
      user: {
        _id: userResponse._id,
        email: userResponse.email,
      },
      token,
    });
  } catch (error: any) {
    console.error("Erro no Login:", error);

    if (error.message === "Invalid credentials") {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};
