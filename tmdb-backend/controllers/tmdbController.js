import fetch from 'node-fetch';

export const searchTMDB = async (req, res, next) => {
  try {
    const { query, page } = req.query;
    if (!query) return res.status(400).json({ error: 'Parametro query mancante' });

    const tmdbUrl = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&page=${page || 1}`;
    const response = await fetch(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Errore TMDB', details: await response.text() });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
