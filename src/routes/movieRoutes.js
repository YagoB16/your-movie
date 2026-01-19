import express from "express";
import {
  createMovie,
  listMovies,
  updateMovieById,
  deleteMovieById,
} from "../controllers/movieController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { movieSchema } from "../services/movieValidation.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = express.Router();

/**
 * @api {get} /movies Listar Filmes
 * @apiName GetMovies
 * @apiGroup Filmes
 * @apiPermission Bearer Token
 *
 * @apiHeader {String} Authorization Token JWT no formato: "Bearer seu_token_aqui".
 * @apiHeaderExample {json} Header-Example:
 * {
 * "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
 * }
 *
 * @apiSuccess {Object[]} filmes Lista de filmes cadastrados.
 * @apiSuccess {String} filmes.id ID único do filme no Firestore.
 * @apiSuccess {String} filmes.titulo Título do filme.
 * @apiSuccess {String} filmes.descricao Descrição da trama.
 * @apiSuccess {Number} filmes.ano_lancamento Ano em que o filme foi lançado.
 *
 * @apiSuccessExample {json} Sucesso-Exemplo:
 * HTTP/1.1 200 OK
 * [
 * {
 * "id": "Jk8Lp9q2Z",
 * "titulo": "Inception",
 * "descricao": "Um ladrão que rouba segredos através da tecnologia de sonhos.",
 * "ano_lancamento": 2010
 * }
 * ]
 *
 * @apiError (Erro 401) {String} message Mensagem de erro caso o token seja inválido ou ausente.
 */
router.get("/", authMiddleware, listMovies);

router.post("/", authMiddleware, validate(movieSchema), createMovie);
router.put("/:id", authMiddleware, validate(movieSchema), updateMovieById);
router.delete("/:id", authMiddleware, deleteMovieById);

export default router;
