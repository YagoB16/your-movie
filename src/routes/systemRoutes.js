import express from 'express';
import { checkServer } from '../controllers/systemController.js';

const router = express.Router();

/**
 * @api {get} /system/health Health Check
 * @apiName GetHealth
 * @apiGroup Sistema
 * @apiDescription Verifica o estado de saúde da API e a conectividade com o Firestore.
 *
 * @apiSuccess {Object} services Status dos serviços integrados.
 * @apiSuccess {String} services.server Status do processo Node.js.
 * @apiSuccess {String} services.database Status da conexão com o Firebase.
 * @apiSuccess {String} uptime Tempo de atividade do servidor em segundos.
 *
 * @apiSuccessExample {json} Sucesso-Exemplo:
 * HTTP/1.1 200 OK
 * {
 * "uptime": 125.45,
 * "message": "OK",
 * "timestamp": "2026-01-21T21:40:00.000Z",
 * "services": {
 * "server": "ONLINE",
 * "database": "CONNECTED"
 * }
 * }
 *
 * @apiError (Erro 503) {String} message "ERROR"
 * @apiError (Erro 503) {Object} services Detalhes da falha de conexão.
 */
router.get('/health', checkServer);

export default router;
