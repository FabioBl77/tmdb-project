import fetch from 'node-fetch';

// --- RICERCA FILM SU TMDB ---
export const searchMovies = async (req, res, next) => {
  try {
    const query = req.query.q; // parametro "q" dall'URL
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Parametro query mancante' });
    }

    // Chiamata all'API TMDB per la ricerca
    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      return res.status(404).json({ error: 'Nessun film trovato' });
    }

    // Aggiungo locandina e regista per ogni film
    const moviesWithDetails = await Promise.all(
      searchData.results.map(async (movie) => {
        try {
          const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits`
          );
          const detailsData = await detailsResponse.json();

          let director = 'Non disponibile';
          if (detailsData.credits?.crew) {
            const dir = detailsData.credits.crew.find((member) => member.job === 'Director');
            if (dir) director = dir.name;
          }

          return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_url: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            director
          };
        } catch {
          // Se fallisce il fetch dei dettagli, ritorno i dati base
          return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_url: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            director: 'Non disponibile'
          };
        }
      })
    );

    res.status(200).json(moviesWithDetails);
  } catch (error) {
    next(error);
  }
};
