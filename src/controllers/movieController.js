import movieModel from '../models/movieModel.js';

const {
    createMovie: createService,
    getMovies: getService,
    updateMovie: updateService,
    deleteMovie: deleteService
} = movieModel;


export const createMovie = async (req, res) => {
    try {
        const result = await createService(req.body);
        res.status(201).json({ message: 'Filme criado!', info: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const listMovies = async (req, res) => {
    try {
        const result = await getService();
        res.status(200).json({ filmes: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateMovieById = async (req, res) => {
    try {
        const result = await updateService(req.params.id, req.body);
        res.status(200).json({ message: 'Atualizado com sucesso', movie: result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteMovieById = async (req, res) => {
    try {
        await deleteService(req.params.id);
        res.status(200).json({ message: 'Filme deletado' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
