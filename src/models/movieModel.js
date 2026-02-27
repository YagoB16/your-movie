import { db } from "../config/database.js";


const moviesCollection = db.collection("movies");

const createMovie = async (data) => {
 
  const querySnapshot = await moviesCollection
    .where("titulo", "==", data.titulo)
    .where("ano_lancamento", "==", data.anoLancamento)
    .get();

  if (!querySnapshot.empty) {
    const error = new Error("Este filme já está cadastrado no catálogo.");
    error.statusCode = 409;
    throw error;
  }
  
  const docRef = await moviesCollection.add({
    titulo: data.titulo,
    descricao: data.descricao,
    ano_lancamento: data.anoLancamento,
    external_data: data.externalData,
  });

  return {
    id: docRef.id,
    titulo: data.titulo,
    descricao: data.descricao,
    anoLancamento: data.anoLancamento,
    external_data: data.externalData,
  };
};

const getMovies = async () => {
  // Sintaxe de get all: .get()
  const snapshot = await moviesCollection.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      titulo: data.titulo,
      descricao: data.descricao,
      anoLancamento: data.ano_lancamento,
      external_data: data.external_data
    };
  });
};

const getMovieById = async (id) => {  
  const movieSnap = await moviesCollection.doc(id).get();

  if (!movieSnap.exists) { 
    const error = new Error("Filme não encontrado no banco de dados.");
    error.statusCode = 404;
    throw error;
  }

  const data = movieSnap.data();
  return {
    id: movieSnap.id,
    titulo: data.titulo,
    descricao: data.descricao,
    anoLancamento: data.ano_lancamento,
    external_data: data.external_data
  };
};

const updateMovie = async (id, data) => {
  const movieRef = moviesCollection.doc(id);
  const movieSnap = await movieRef.get();

  if (!movieSnap.exists) {
    const error = new Error("Filme não encontrado no banco de dados.");
    error.statusCode = 404;
    throw error;
  }

  const dataToUpdate = {};
  if (data.titulo) dataToUpdate.titulo = data.titulo;
  if (data.descricao) dataToUpdate.descricao = data.descricao;
  if (data.anoLancamento) dataToUpdate.ano_lancamento = data.anoLancamento;
  if (data.imdbID) dataToUpdate.imdbID = data.imdbID;

  // Sintaxe de update: .update()
  await movieRef.update(dataToUpdate);
  return { id, ...dataToUpdate };
};

const deleteMovie = async (id) => {
  const movieRef = moviesCollection.doc(id);
  const movieSnap = await movieRef.get();

  if (!movieSnap.exists) {
    const error = new Error("Filme não encontrado no banco de dados.");
    error.statusCode = 404;
    throw error;
  }

  // Sintaxe de delete: .delete()
  await movieRef.delete();
  return id;
};

export default { createMovie, getMovies, updateMovie, deleteMovie, getMovieById };