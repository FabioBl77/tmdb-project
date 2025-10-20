import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

// Strategia locale: login con username e password
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        // Cerco l’utente nel DB
        const user = await User.findOne({ where: { username } });
        if (!user) {
          return done(null, false, { statusCode: 401, message: 'Utente non trovato' });
        }

        // Confronto password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { statusCode: 401, message: 'Password errata' });
        }

        // Login riuscito
        return done(null, user);
      } catch (err) {
        // Errore interno → 500 Internal Server Error
        return done(err);
      }
    }
  )
);

// Serializzo l’utente nella sessione
passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

// Deserializzo l’utente dalla sessione
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return done({ statusCode: 404, message: 'Utente non trovato' }, null);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
