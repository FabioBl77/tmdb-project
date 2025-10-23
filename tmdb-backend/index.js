import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import SequelizeStoreLib from 'connect-session-sequelize';
import { sequelize } from './config/database.js';

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import dei modelli
import './models/User.js';
import './models/Movie.js';
import './models/RefreshToken.js';

import './passport/passport.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import tmdbRoutes from './routes/tmdb.js';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SequelizeStore = SequelizeStoreLib(session.Store);
const sessionStore = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Sincronizza solo la tabella delle sessioni
sessionStore.sync();

// Inizializza Passport
app.use(passport.initialize());
app.use(passport.session());

// Rotte
app.use('/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/tmdb', tmdbRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Backend TMDB Node.js attivo!' });
});

// Middleware globale gestione errori
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || 'Errore interno del server';
  res.status(status).json({
    error: message,
    method: req.method,
    endpoint: req.originalUrl,
  });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connessione al database riuscita');

    // Sincronizza tutti i modelli con il DB
    await sequelize.sync({ alter: true }); // alter:true aggiorna tabelle senza cancellare dati
    console.log('Tabelle sincronizzate correttamente');

    app.listen(PORT, () => {
      console.log(`Server avviato su http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Errore connessione DB:', error);
    process.exit(1);
  }
})();
