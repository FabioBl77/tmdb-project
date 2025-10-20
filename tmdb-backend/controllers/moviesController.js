import { Movie } from '../models/Movie.js';
import { Op } from 'sequelize';

// --- GET FILM CON FILTRI ---
export const getMovies = async (req, res, next) => {
  try {
    const filters = {};

    // Filtro per anno
    if (req.query.year) {
      filters.release_date = { [Op.like]: `${req.query.year}%` };
    }

    // Filtro per genere
    if (req.query.genre) {
      filters.genre = req.query.genre; // Assumendo che il campo nel modello sia 'genre'
    }

    const movies = await Movie.findAll({ where: filters });
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

// --- GET FILM PER ID ---
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Film non trovato' });
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

// --- CREAZIONE FILM ---
export const createMovie = async (req, res, next) => {
  try {
    const { tmdbId, title, description, release_date, genre, poster_path, director, runtime, cast } = req.body;

    if (!tmdbId || !title) return res.status(400).json({ error: 'Dati film incompleti' });

    const existing = await Movie.findOne({ where: { tmdbId } });
    if (existing) return res.status(400).json({ error: 'Film già salvato' });

    const newMovie = await Movie.create({
      tmdbId,
      title,
      description,
      release_date,
      genre,
      poster_path,
      director,
      runtime,
      cast
    });

    res.status(201).json(newMovie);
  } catch (error) {
    next(error);
  }
};

// --- AGGIORNA FILM ---
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

// --- CANCELLA FILM ---
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
