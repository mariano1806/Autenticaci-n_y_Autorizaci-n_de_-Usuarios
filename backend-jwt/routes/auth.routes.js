import { Router } from 'express';
import { login, session, logout, register } from '../controllers/auth.controller.js';

import  validarJwt  from '../middlewares/validar-jwt.js';

const router = Router();

router.post('/login', login);
router.get('/session', validarJwt,session);
router.post('/logout', logout);
router.post('/register', register);

export {router} ;