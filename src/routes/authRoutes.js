import express from "express";
import {
    login,
    register,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { registerSchema, loginSchema } from "../services/registerValidation.js"
const router = express.Router();

/**
 * @api {post} /auth/register Registrar Usuário
 * @apiName RegisterUser
 * @apiGroup Autenticação
 *
 * @apiBody {String} email E-mail válido do usuário.
 * @apiBody {String} senha Senha (mínimo 6 caracteres).
 * @apiBody {String="admin","user"} [role="user"] Nível de acesso.
 *
 * @apiSuccess (Sucesso 201) {Boolean} success Status da operação.
 * @apiSuccess (Sucesso 201) {String} message Mensagem de sucesso.
 * @apiSuccess (Sucesso 201) {String} token JWT gerado para o usuário.
 *
 * @apiError (Erro 400) {String} status Erro de Validação.
 * @apiError (Erro 400) {Object[]} erros Detalhes dos campos inválidos.
 */
router.post("/register", validate(registerSchema), register);

/**
 * @api {post} /auth/login Autenticar Usuário
 * @apiName LoginUser
 * @apiGroup Autenticação
 * @apiDescription Autentica o usuário e retorna um Token JWT para acesso às rotas protegidas.
 *
 * @apiBody {String} email E-mail cadastrado.
 * @apiBody {String} senha Senha do usuário.
 *
 * @apiSuccess {Object} user Dados básicos do usuário autenticado.
 * @apiSuccess {String} user.id ID único do usuário no banco.
 * @apiSuccess {String} user.email E-mail do usuário.
 * @apiSuccess {String} token Token JWT (Bearer) para ser usado no header de autorização.
 *
 * @apiSuccessExample {json} Sucesso-Exemplo:
 * HTTP/1.1 200 OK
 * {
 * "user": {
 * "id": "l4A0qlmMCxZ4V7JUmad9",
 * "email": "yago@teste.com"
 * },
 * "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * @apiError (Erro 401) {String} message "Usuário ou senha inválidos."
 * @apiError (Erro 500) {String} message "Erro interno no servidor."
 */
router.post("/login", validate(loginSchema), login);


/**
 * @api {post} /auth/forgot-password Solicitar recuperação de senha
 * @apiDescription Gera um PIN de 6 dígitos e envia para o e-mail do usuário.
 */
router.post("/forgot-password", forgotPassword);

/**
 * @api {post} /auth/reset-password Redefinir senha com PIN
 * @apiDescription Valida o PIN e atualiza a senha do usuário no banco.
 */
router.post("/reset-password", resetPassword);

export default router;
