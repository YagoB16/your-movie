import { db } from '../config/database.js';

const usersCollection = db.collection('users');
const resetsCollection = db.collection('password_resets');

const findUserByEmail = async (email) => {
    const querySnapshot = await usersCollection.where("email", "==", email).get();
    if (querySnapshot.empty) return null;
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
};

const createUser = async (userData) => {
    const docRef = await usersCollection.add({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user',
        createdAt: new Date()
    });
    return { id: docRef.id, ...userData };
};

const createPasswordReset = async (email, pin) => {
      
    await resetsCollection.add({
        email,
        pin,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });
};

const findResetByEmailAndPin = async (email, pin) => {
    const snapshot = await resetsCollection
        .where('email', '==', email)
        .where('pin', '==', pin)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

const deleteResetPins = async (email) => {
    const snapshot = await resetsCollection.where('email', '==', email).get();
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
};

const updateUserPassword = async (userId, hashedPassword) => {
    await usersCollection.doc(userId).update({
        password: hashedPassword
    });
};

export default {
    findUserByEmail,
    createUser,
    createPasswordReset,
    findResetByEmailAndPin,
    deleteResetPins,
    updateUserPassword
};