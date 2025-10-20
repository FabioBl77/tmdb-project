import express from 'express';
import { verifyToken } from '../middleware/authorization.js';
import { searchTMDB } from '../controllers/tmdbController.js';

const router = express.Router();

router.get('/search', verifyToken, searchTMDB);

export default router;
