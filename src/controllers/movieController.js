import movieModel from "../models/movieModel.js";

const {
  createMovie: createService,
  getMovies: getService,
  updateMovie: updateService,
  deleteMovie: deleteService,
} = movieModel;

export const createMovie = async (req, res, next) => {
  try {
    const result = await createService(req.body);
    res.status(201).json({
      success: true,
      message: "Filme criado!",
      info: result,
    });
  } catch (error) {
    next(error); // Delega para o Middleware Global
  }
};

export const listMovies = async (req, res, next) => {
  try {
    const result = await getService();
    res.status(200).json({
      success: true,
      filmes: result,
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
      movie: result,
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
