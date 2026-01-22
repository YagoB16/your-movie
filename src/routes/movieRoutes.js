import express from "express";
import {
  createMovie,
  listMovies,
  listMovieByDatabaseId,
  externalListMovieById,
  externalSearchMovie,
  updateMovieById,
  deleteMovieById,
} from "../controllers/movieController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { movieSchema, updateMovieSchema } from "../services/movieValidation.js";
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

/**
 * @api {get} /movies/:id Detalhes do Filme (Banco Local)
 * @apiName GetMovieFromDB
 * @apiGroup Filmes
 * @apiPermission Bearer Token
 *
 * @apiDescription Busca as informações de um filme cadastrado no seu catálogo do Firestore utilizando o ID interno.
 *
 * @apiHeader {String} Authorization Token JWT no formato: "Bearer seu_token_aqui".
 *
 * @apiParam {String} id ID único gerado pelo Firestore (ex: "wtHsBrAcCKi3onCBLEv1").
 *
 * @apiSuccess {Boolean} success Status da operação (true).
 * @apiSuccess {Object} data Objeto contendo os dados do filme salvos no banco.
 * @apiSuccess {String} data.id ID do documento.
 * @apiSuccess {String} data.titulo Título do filme.
 * @apiSuccess {String} data.descricao Sinopse salva.
 * @apiSuccess {Number} data.anoLancamento Ano de lançamento.
 *
 * @apiSuccessExample {json} Sucesso-Exemplo:
 * HTTP/1.1 200 OK
 * {
 * "success": true,
 * "data": {
 * "id": "wtHsBrAcCKi3onCBLEv1",
 * "titulo": "Inception",
 * "descricao": "Um ladrão que rouba segredos através da tecnologia de sonhos.",
 * "anoLancamento": 2010
 * }
 * }
 *
 * @apiError (Erro 404) {String} message "Filme não encontrado no banco de dados."
 */
router.get("/:id", authMiddleware, listMovieByDatabaseId);

/**
 * @api {get} /movies/external/search Buscar Filmes (OMDb)
 * @apiName SearchMoviesExternal
 * @apiGroup API Externa
 * @apiPermission Bearer Token
 *
 * @apiDescription Realiza uma busca por termo na API da OMDb utilizando Query Parameters.
 * Retorna uma lista de filmes que correspondem ao nome enviado.
 *
 * @apiHeader {String} Authorization Token JWT no formato: "Bearer seu_token_aqui".
 *
 * @apiQuery {String} q Termo de busca enviado na URL (ex: ?q=Batman).
 *
 * @apiSuccess {Boolean} success Status da operação (true).
 * @apiSuccess {Object} data Objeto contendo os resultados brutos da OMDb.
 * @apiSuccess {Object[]} data.Search Lista de filmes encontrados.
 * @apiSuccess {String} data.totalResults Quantidade total de registros na base externa.
 * @apiSuccess {String} data.Response Resposta lógica da API ("True" ou "False").
 *
 * @apiSuccessExample {json} Sucesso-Exemplo:
 * HTTP/1.1 200 OK
 * {
 * "success": true,
 * "data": {
 * "Search": [
 * {
 * "Title": "Batman Begins",
 * "Year": "2005",
 * "imdbID": "tt0372784",
 * "Type": "movie",
 * "Poster": "https://m.media-amazon.com/..."
 * }
 * ],
 * "totalResults": "1",
 * "Response": "True"
 * }
 * }
 * * @apiError (Erro 404) {String} message "Movie not found!" (Quando a OMDb não encontra resultados).
 */
router.get("/external/search", authMiddleware, externalSearchMovie);

/**
 * @api {get} /movies/external/:id Detalhes do Filme (OMDb)
 * @apiName GetExternalMovieById
 * @apiGroup API Externa
 * @apiPermission Bearer Token
 *
 * @apiDescription Busca informações detalhadas (sinopse, atores, notas) de um filme específico na OMDb utilizando o ID do IMDB.
 *
 * @apiHeader {String} Authorization Token JWT: "Bearer seu_token_aqui".
 *
 * @apiParam {String} id ID do IMDB (ex: "tt0372784").
 *
 * @apiSuccess {Boolean} success Status da operação (true).
 * @apiSuccess {Object} data Objeto com os detalhes completos do filme.
 *
 * @apiSuccessExample {json} Sucesso-Exemplo:
 * HTTP/1.1 200 OK
 * {
 * "success": true,
 * "data": {
 * "Title": "Batman Begins",
 * "Plot": "After training with his mentor, Batman begins his fight to free crime-ridden Gotham City...",
 * "Actors": "Christian Bale, Michael Caine, Liam Neeson",
 * "imdbRating": "8.2",
 * "Response": "True"
 * }
 * }
 *
 * @apiError (Erro 404) {String} message "Movie not found!" (Retornado pela OMDb via Service).
 */
router.get("/external/:id", authMiddleware, externalListMovieById);

/**
 * @api {post} /movies Criar Filme
 * @apiName CreateMovie
 * @apiGroup Filmes
 * @apiPermission Bearer Token
 *
 * @apiDescription Cadastra um novo filme no catálogo do sistema "Your-Movie".
 * Se o `imdbID` for fornecido, o sistema busca automaticamente informações extras (atores, poster, notas) na API da OMDb antes de salvar.
 *
 * @apiHeader {String} Authorization Token de acesso JWT no formato: "Bearer seu_token_aqui".
 *
 * @apiBody {String} titulo Nome do filme (mínimo de 2 caracteres).
 * @apiBody {String} descricao Resumo da trama (mínimo de 10 caracteres).
 * @apiBody {Number} anoLancamento Ano de estreia (entre 1895 e o ano atual + 5).
 * @apiBody {String} [imdbID] ID opcional do IMDB para buscar dados extras automaticamente.
 *
 * @apiSuccess (Sucesso 201) {Boolean} success Indica se o filme foi criado.
 * @apiSuccess (Sucesso 201) {String} message Mensagem de confirmação: "Filme criado!".
 * @apiSuccess (Sucesso 201) {Object} info Dados completos do filme salvos no Firestore.
 * @apiSuccess (Sucesso 201) {String} info.id ID único gerado pelo banco.
 * @apiSuccess (Sucesso 201) {Number} info.ano_lancamento Ano salvo no banco em snake_case.
 * @apiSuccess (Sucesso 201) {Object} [info.external_data] Dados enriquecidos vindos da API externa.
 *
 * @apiSuccessExample {json} Sucesso-Exemplo:
 * HTTP/1.1 201 Created
 * {
 * "success": true,
 * "message": "Filme criado!",
 * "info": {
 * "id": "wtHsBrAcCKi3onCBLEv1",
 * "titulo": "Batman 2",
 * "descricao": "The Dark Knight of Gotham City...",
 * "ano_lancamento": 2025,
 * "external_data": {
 * "diretor": "Matt Reeves",
 * "atores": "Robert Pattinson, Zoë Kravitz",
 * "poster": "https://m.media-amazon.com/...",
 * "imdbRating": "7.8"
 * }
 * }
 * }
 *
 * @apiError (Erro 400) {String} status "Erro de Validação".
 * @apiError (Erro 409) {String} message "Este filme já está cadastrado no catálogo."
 */
router.post("/", authMiddleware, validate(movieSchema), createMovie);

/**
 * @api {put} /movies/:id Atualizar Filme
 * @apiName UpdateMovie
 * @apiGroup Filmes
 * @apiPermission Bearer Token
 *
 * @apiDescription Atualiza parcialmente os dados de um filme existente.
 * O sistema verifica a existência do ID antes da operação.
 *
 * @apiHeader {String} Authorization Token JWT: "Bearer seu_token_aqui".
 *
 * @apiParam {String} id ID único do documento no Firestore.
 *
 * @apiBody {String} [titulo] Título do filme (mínimo 2 caracteres).
 * @apiBody {String} [descricao] Descrição (mínimo 10 caracteres).
 * @apiBody {Number} [anoLancamento] Ano de lançamento (mínimo 1895).
 * @apiBody {String} [imdbID] ID referencial do IMDB.
 *
 * @apiSuccess {Boolean} success Status da operação (true).
 * @apiSuccess {String} message Mensagem: "Atualizado com sucesso".
 * @apiSuccess {Object} movie Objeto com os campos atualizados em snake_case.
 * @apiSuccess {String} movie.id ID do filme.
 * @apiSuccess {Number} [movie.ano_lancamento] Ano atualizado no banco.
 *
 * @apiSuccessExample {json} Sucesso-Exemplo:
 * HTTP/1.1 200 OK
 * {
 * "success": true,
 * "message": "Atualizado com sucesso",
 * "movie": {
 * "id": "dccgj2UTjkgXU8udUWo",
 * "titulo": "Batman",
 * "ano_lancamento": 1929,
 * "descricao": "lorem pispodas lasdoal asdplasdl lorem ipsu terste"
 * }
 * }
 *
 * @apiError (Erro 404) {Boolean} success Status da operação (false).
 * @apiError (Erro 404) {Number} status Código 404.
 * @apiError (Erro 404) {String} message "Filme não encontrado no banco de dados."
 */
router.put("/:id", authMiddleware, validate(updateMovieSchema), updateMovieById);

/**
 * @api {delete} /movies/:id Deletar Filme
 * @apiName DeleteMovie
 * @apiGroup Filmes
 * @apiPermission Bearer Token
 *
 * @apiDescription Remove permanentemente um filme do banco de dados Firestore.
 * O sistema valida se o ID existe antes de processar a exclusão.
 *
 * @apiHeader {String} Authorization Token JWT: "Bearer seu_token_aqui".
 *
 * @apiParam {String} id ID único do documento no Firestore.
 *
 * @apiSuccess (Sucesso 200) {Boolean} success Status da operação (true).
 * @apiSuccess (Sucesso 200) {String} message Mensagem: "Filme deletado".
 *
 * @apiSuccessExample {json} Sucesso-Exemplo:
 * HTTP/1.1 200 OK
 * {
 * "success": true,
 * "message": "Filme deletado"
 * }
 *
 * @apiError (Erro 404) {Boolean} success Status da operação (false).
 * @apiError (Erro 404) {Number} status Código 404.
 * @apiError (Erro 404) {String} message "Filme não encontrado no banco de dados."
 * @apiError (Erro 401) {String} message "Token inválido ou expirado."
 */
router.delete("/:id", authMiddleware, deleteMovieById);

export default router;
