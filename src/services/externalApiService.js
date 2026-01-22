import axios from "axios";
import "dotenv/config";

const BASE_URL = "https://www.omdbapi.com/";

export const getMovieById = async (imdbID) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?i=${imdbID}&apikey=${process.env.API_KEY}`,
    );

    if (response.data.Response === "False") {
      throw new Error(response.data.Error);
    }

    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar ID na API externa: " + error.message);
  }
};

export const searchMovie = async (search) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?s=${search}&apikey=${process.env.API_KEY}`,
    );

    if (response.data.Response === "False") {
      throw new Error(response.data.Error);
    }

    return response.data;
  } catch (error) {
    throw new Error("Falha ao buscar termo na API externa: " + error.message);
  }
};

export const fetchExternalMovieData = async (imdbID) => {
  try {
    const data = await getMovieById(imdbID);

    return {
      diretor: data.Director,
      atores: data.Actors,
      genero: data.Genre,
      imdbRating: data.imdbRating,
      poster: data.Poster,
      sinopse: data.Plot,
    };
  } catch (error) {
    console.error("Erro ao processar dados extras:", error.message);
    return null;
  }
};
