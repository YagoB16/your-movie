import { db } from "../config/database.js";
import { collection, getDocs, limit, query } from "firebase/firestore";

export const checkServer = async (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    services: {
      database: 'PENDING'
    }
  };

  try {
 
    const q = query(collection(db, "movies"), limit(1));
    await getDocs(q);

    healthcheck.services.database = 'CONNECTED';
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = 'ERROR';
    healthcheck.services.database = 'DISCONNECTED';
    healthcheck.error = error.message;
    res.status(503).json(healthcheck); // 503 Service Unavailable
  }
};
