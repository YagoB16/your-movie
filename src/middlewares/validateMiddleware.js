import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {

      const errorMessages = error.issues?.map((err) => ({
        campo: err.path[0],
        mensagem: err.message
      })) || []; 

      return res.status(400).json({
        success: false,
        status: "Erro de Validação",
        erros: errorMessages
      });
    }

    next(error);
  }
};
