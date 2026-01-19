import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string({
    required_error: "O e-mail é obrigatório",
    invalid_type_error: "O e-mail deve ser uma string",
  }).email("Insira um formato de e-mail válido"),

  senha: z.string({
    required_error: "A senha é obrigatória",
  }).min(6, "A senha deve ter pelo menos 6 caracteres"),

  role: z.enum(["admin", "user"], {
    error_map: () => ({ message: "A role deve ser 'admin' ou 'user'" })
  }).default("user") 
});
