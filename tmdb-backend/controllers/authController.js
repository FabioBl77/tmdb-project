import passport from 'passport';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtHelper.js';

export const loginUser = (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err) return next(err);
      if (!user) return res.status(info?.statusCode || 401).json({ error: info?.message || 'Autenticazione fallita' });

      const accessToken = generateAccessToken(user);
      const refreshTokenValue = generateRefreshToken(user);

      await RefreshToken.create({
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      req.login(user, { session: true }, (loginErr) => {
        if (loginErr) return next(loginErr);
        res.status(200).json({
          message: 'Login riuscito',
          accessToken,
          refreshToken: refreshTokenValue,
          user: { id: user.id, username: user.username, role: user.role }
        });
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

export const logoutUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Utente non autenticato' });

    await RefreshToken.update({ revoked: true }, { where: { userId: user.id } });

    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err2) => {
        if (err2) return next(err2);
        res.status(200).json({ message: 'Logout riuscito' });
      });
    });
  } catch (error) {
    next(error);
  }
};

export const refreshUserToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Refresh token mancante' });

    const tokenEntry = await RefreshToken.findOne({ where: { token: refreshToken, revoked: false } });
    if (!tokenEntry) return res.status(403).json({ error: 'Refresh token non valido' });

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Refresh token scaduto o non valido' });

      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(404).json({ error: 'Utente non trovato' });

      const newAccessToken = generateAccessToken(user);
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Utente non autenticato' });
    res.status(200).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (error) {
    next(error);
  }
};
