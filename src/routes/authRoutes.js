import express from "express";
import { login, register } from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import {registerSchema} from "../services/registerValidation.js"
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

router.post("/login", login);

export default router;
