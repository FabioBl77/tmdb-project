import { Movie } from '../models/Movie.js';
import { Op } from 'sequelize';

// --- GET FILM CON FILTRI ---
// Possibili query string: ?title=...&genre=...&director=...&year=...
export const getMovies = async (req, res, next) => {
  try {
    const { title, genre, director, year } = req.query;

    // Filtra solo i film dell'utente loggato
    const filters = { userId: req.user.id };

    if (title) filters.title = { [Op.like]: `%${title}%` };
    if (genre) filters.genre = { [Op.like]: `%${genre}%` };
    if (director) filters.director = { [Op.like]: `%${director}%` };
    if (year) filters.release_date = { [Op.like]: `${year}%` };

    const movies = await Movie.findAll({ where: filters });
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

// --- GET FILM PER ID ---
export const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({
      where: { id: req.params.id, userId: req.user.id } // Solo il film dell'utente
    });
    if (!movie) return res.status(404).json({ error: 'Film non trovato' });
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

// --- CREAZIONE FILM ---
export const createMovie = async (req, res, next) => {
  try {
    const { tmdb_id, title, genre, runtime, cast, director, description, release_date, poster_path } = req.body;
    if (!tmdb_id || !title) return res.status(400).json({ error: 'tmdb_id e title richiesti' });

    const existing = await Movie.findOne({ where: { tmdb_id, userId: req.user.id } });
    if (existing) return res.status(400).json({ error: 'Film già presente nel DB dell’utente' });

    const newMovie = await Movie.create({
      tmdb_id,
      title,
      genre,
      runtime,
      cast,
      director,
      description,
      release_date,
      poster_path,
      userId: req.user.id // Assegna il film all'utente
    });

    res.status(201).json({ message: 'Film salvato', movie: newMovie });
  } catch (error) {
    next(error);
  }
};

// --- AGGIORNA FILM ---
export const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({
      where: { id: req.params.id, userId: req.user.id } // Solo i film dell'utente
    });
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
    const movie = await Movie.findOne({
      where: { id: req.params.id, userId: req.user.id } // Solo i film dell'utente
    });
    if (!movie) return res.status(404).json({ error: 'Film non trovato' });

    await movie.destroy();
    res.status(200).json({ message: 'Film eliminato con successo' });
  } catch (error) {
    next(error);
  }
};
