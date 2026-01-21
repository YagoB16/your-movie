import { db } from "../config/database.js";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
} from "firebase/firestore";

const moviesCollection = collection(db, "movies");

const createMovie = async (data) => {
    const q = query(
    moviesCollection,
    where("titulo", "==", data.titulo),
    where("ano_lancamento", "==", data.anoLancamento),
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const error = new Error("Este filme já está cadastrado no catálogo.");
    error.statusCode = 409; 
    throw error;
  }

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
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      titulo: data.titulo,
      descricao: data.descricao,
      anoLancamento: data.ano_lancamento,
    };
  });
};

const updateMovie = async (id, data) => {
  const movieRef = doc(db, "movies", id);

  const movieSnap = await getDoc(movieRef);

  if (!movieSnap.exists()) {
    const error = new Error("Filme não encontrado no banco de dados.");
    error.statusCode = 404;
    throw error;
  }

  //Transformar meus campos camelCase em snake_case
  const dataToUpdate = {};

  if (data.titulo) dataToUpdate.titulo = data.titulo;
  if (data.descricao) dataToUpdate.descricao = data.descricao;
  if (data.anoLancamento) dataToUpdate.ano_lancamento = data.anoLancamento;
  if (data.imdbID) dataToUpdate.imdbID = data.imdbID;

  await updateDoc(movieRef, dataToUpdate);
  return { id, ...dataToUpdate };
};

const deleteMovie = async (id) => {
  const movieRef = doc(db, "movies", id);
  const movieSnap = await getDoc(movieRef);

  if (!movieSnap.exists()) {
    const error = new Error("Filme não encontrado no banco de dados.");
    error.statusCode = 404;
    throw error;
  }

  await deleteDoc(movieRef);
  return id;
};

export default { createMovie, getMovies, updateMovie, deleteMovie };
