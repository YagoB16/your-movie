import { z } from 'zod';

export const movieSchema = z.object({
  titulo: z.string({
    required_error: "O título é obrigatório",
  }).min(2, "O título deve ter pelo menos 2 caracteres"),

  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),

  anoLancamento: z.number({
    required_error: "O ano de lançamento é obrigatório",
  }).min(1895, "O ano deve ser superior ao nascimento do cinema (1895)")
    .max(new Date().getFullYear() + 5, "Ano de lançamento inválido")
});

export const updateMovieSchema = movieSchema.partial();
