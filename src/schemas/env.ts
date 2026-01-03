import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string().min(1, "JWT_SECRET é obrigatório"),
  MONGO_URI: z.string().min(1, "MONGO_URI é obrigatório"),
  PORT: z.string().min(1, "PORT é obrigatório"),
});

export const env = envSchema.parse(process.env);
