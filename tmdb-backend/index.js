import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import SequelizeStoreLib from 'connect-session-sequelize';
import { sequelize } from './config/database.js';
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

sessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());

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
    endpoint: req.originalUrl
  });
});


const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connessione al database riuscita');
    app.listen(PORT, () => {
      console.log(`Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Errore connessione DB:', err);
    process.exit(1);
  });
