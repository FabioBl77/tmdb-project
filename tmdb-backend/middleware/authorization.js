import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Verifica che sia presente un JWT valido
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token mancante' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token non valido' });

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token scaduto o non valido' });

    try {
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(404).json({ error: 'Utente non trovato' });

      req.user = user; // aggiunge utente alla richiesta
      next();
    } catch (error) {
      next(error);
    }
  });
};

// Verifica che l’utente abbia il ruolo richiesto
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Utente non autenticato' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Accesso negato' });
    next();
  };
};
