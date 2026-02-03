import { db } from '../config/database.js';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const usersCollection = collection(db, 'users');

const findUserByEmail = async (email) => {
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
};


const createUser = async (userData) => {
    const docRef = await addDoc(usersCollection, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user',
        createdAt: new Date()
    });
    return { id: docRef.id, ...userData };
};


export default { findUserByEmail, createUser };
