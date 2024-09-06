import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/env.js';
import { database } from '../db/database.js';
const conn = await database()
export default async (req, res, next) => {
    const token = req.cookies.authToken || req.session.token;

    if (!token) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Se busca al usuario en la base de datos
        const [[user]] = await conn.query('SELECT * from users where id = ?',[decoded.userId])
        if (!user) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        req.user = user; // Agrega la información del usuario decodificada al request  
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido o expirado' });
    }
};