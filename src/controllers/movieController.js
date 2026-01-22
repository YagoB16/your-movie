import movieModel from "../models/movieModel.js";
import {
  getMovieById as fetchExternalById,
  searchMovie as fetchExternalSearch,
  fetchExternalMovieData,
} from "../services/externalApiService.js";
const {
  createMovie: createService,
  getMovies: getService,
  updateMovie: updateService,
  deleteMovie: deleteService,
} = movieModel;

export const createMovie = async (req, res, next) => {
  try {
    const { imdbID } = req.body;
    let extraInfo = {};

    if (imdbID) {
      extraInfo = await fetchExternalMovieData(imdbID);
    }

    const movieData = { ...req.body, externalData: extraInfo };

    const result = await createService(movieData);
    res.status(201).json({
      success: true,
      message: "Filme criado!",
      info: result,
    });
  } catch (error) {
    next(error);
  }
};

export const externalListMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Busca na OMDb via Service
    const movieData = await fetchExternalById(id);

    res.status(200).json({
      success: true,
      data: movieData,
    });
  } catch (error) {
    next(error);
  }
};

export const externalSearchMovie = async (req, res, next) => {
  const { q } = req.query;
  try {
    const results = await fetchExternalSearch(q);
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const listMovies = async (req, res, next) => {
  try {
    const result = await getService();
    res.status(200).json({
      success: true,
      message: "Filmes listados com sucesso!",
      info: result,
    });
  } catch (error) {
    next(error);
  }
};

export const listMovieByDatabaseId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await movieModel.getMovieById(id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMovieById = async (req, res, next) => {
  try {
    const result = await updateService(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Atualizado com sucesso",
      info: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMovieById = async (req, res, next) => {
  try {
    await deleteService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Filme deletado",
    });
  } catch (error) {
    next(error);
  }
};
