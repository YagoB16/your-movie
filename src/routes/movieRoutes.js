import express from "express";
import {
  createMovie,
  listMovies,
  updateMovieById,
  deleteMovieById,
} from "../controllers/movieController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { movieSchema } from "../services/movieValidation.js";
import { validate } from "../middlewares/validateMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, listMovies);
router.post("/", authMiddleware, validate(movieSchema), createMovie);
router.put("/:id", authMiddleware, validate(movieSchema), updateMovieById);
router.delete("/:id", authMiddleware, deleteMovieById);

export default router;
