import type { Request, Response } from "express";
import { ZodError } from "zod";
import { AuthService } from "../services/auth-service";
import { registerSchema } from "../schemas/register";
import { loginSchema } from "../schemas/login";
import type { RegisterSchemaType } from "../schemas/register";
import type { LoginSchemaType } from "../schemas/login";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const data: RegisterSchemaType = registerSchema.parse(req.body);

    const { user, token } = await authService.register(data);

    return res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Dados inválidos",
      });
    }

    if (error.message === "Usuário já existente") {
      return res.status(409).json({
        error: "Dados inválidos",
      });
    }

    console.error("Erro no Register:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data: LoginSchemaType = loginSchema.parse(req.body);

    const { user, token } = await authService.login(data);

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Dados inválidos",
      });
    }

    if (error.message === "Credenciais Inválidas") {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    console.error("Erro no Login:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};