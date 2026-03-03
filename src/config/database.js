import admin from "firebase-admin";
import 'dotenv/config';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Remove aspas acidentais e converte \n em quebras de linha reais
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/"/g, '').replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
export { db };
