import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Insira um formato de e-mail válido"),
  name: z.string("Insira um nome válido"),
  password: z
    .string({
      required_error: "A senha é obrigatória",
    })
    .min(6, "A senha deve ter pelo menos 6 caracteres"),

  role: z
    .enum(["admin", "user"], {
      error_map: () => ({ message: "A role deve ser 'admin' ou 'user'" }),
    })
    .default("user"),
});

export const loginSchema = registerSchema
  .omit({ role: true, name: true })
  .extend({
    password: z.string({ required_error: "A senha é obrigatória" }),
  });
