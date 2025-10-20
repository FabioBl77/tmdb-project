import { Movie } from '../models/Movie.js';

export const getMovies = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.year) filters.release_date = req.query.year;
    if (req.query.genre) filters.genre = req.query.genre;

    const movies = await Movie.findAll({ where: filters });
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Film non trovato' });
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json(newMovie);
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Film non trovato' });

    await movie.update(req.body);
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Film non trovato' });

    await movie.destroy();
    res.status(200).json({ message: 'Film eliminato con successo' });
  } catch (error) {
    next(error);
  }
};
