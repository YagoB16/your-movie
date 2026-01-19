import { db } from "../config/database.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const moviesCollection = collection(db, "movies");

const createMovie = async (data) => {
  const docRef = await addDoc(moviesCollection, {
    titulo: data.titulo,
    descricao: data.descricao,
    ano_lancamento: data.anoLancamento,
  });
  
  return {
    id: docRef.id,
    titulo: data.titulo,
    descricao: data.descricao,
    ano_lancamento: data.anoLancamento,
  };
};

const getMovies = async () => {
  const snapshot = await getDocs(moviesCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const updateMovie = async (id, data) => {
  const movieRef = doc(db, "movies", id);
  await updateDoc(movieRef, data);
  return { id, ...data };
};

const deleteMovie = async (id) => {
  const movieRef = doc(db, "movies", id);
  await deleteDoc(movieRef);
  return id;
};

export default { createMovie, getMovies, updateMovie, deleteMovie };
