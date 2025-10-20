import express from 'express';
import { loginUser, logoutUser, refreshUserToken, getUserProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshUserToken);
router.get('/profile', getUserProfile);

export default router;
