import express from 'express';
import { createMovie, listMovies, updateMovieById, deleteMovieById } from '../controllers/movieController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, listMovies);
router.post('/', authMiddleware, createMovie);
router.put('/:id', authMiddleware, updateMovieById);
router.delete('/:id', authMiddleware, deleteMovieById);

export default router;
