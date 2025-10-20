import express from 'express';
import { verifyToken, requireRole } from '../middleware/authorization.js';
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from '../controllers/moviesController.js';

const router = express.Router();

router.get('/', verifyToken, getMovies);
router.get('/:id', verifyToken, getMovieById);
router.post('/', verifyToken, requireRole('admin'), createMovie);
router.put('/:id', verifyToken, requireRole('admin'), updateMovie);
router.delete('/:id', verifyToken, requireRole('admin'), deleteMovie);

export default router;
