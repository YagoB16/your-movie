import admin from "firebase-admin";
import { createRequire } from "module";
import 'dotenv/config';

const require = createRequire(import.meta.url);
// Certifique-se de que o arquivo JSON está nesta pasta config
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

export { db };