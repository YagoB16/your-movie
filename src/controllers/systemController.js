import { db } from "../config/database.js";

export const checkServer = async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      server: 'ONLINE',
      database: 'PENDING'
    }
  };

  try {
    // No Admin SDK, a sintaxe é direta no objeto db
    // Vamos apenas tentar listar 1 documento da coleção 'movies'
    const snapshot = await db.collection("movies").limit(1).get();

    healthcheck.services.database = 'CONNECTED';
    res.status(200).json(healthcheck);
  } catch (error) {
    console.error("Erro no Health Check:", error.message);
    healthcheck.message = 'ERROR';
    healthcheck.services.database = 'DISCONNECTED';
    healthcheck.error = error.message;
    
    // O Render considera qualquer status diferente de 200 como falha no deploy
    res.status(503).json(healthcheck); 
  }
};
