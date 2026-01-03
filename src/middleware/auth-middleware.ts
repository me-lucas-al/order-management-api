import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../schemas/env";

interface TokenPayload extends JwtPayload {
  id: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authorization.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ error: "Erro no formato do token" });
  }

  const [schema, token] = parts;

  if (schema !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof decoded !== "object" ||
      !decoded ||
      !("id" in decoded)
    ) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = (decoded as TokenPayload).id;

    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}