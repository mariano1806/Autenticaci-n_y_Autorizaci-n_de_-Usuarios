import express from 'express';
import { login, getSession, logout, register } from '../controllers/auth.controllers.js';

const router = express.Router();

router.post('/login', login);
router.get('/session', getSession);
router.post('/logout', logout);
router.post('/register', register);

export default router;