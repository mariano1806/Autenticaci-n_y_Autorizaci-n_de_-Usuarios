import { database } from '../db/database.js';
import bcrypt from 'bcrypt';

// Registrar usuario
export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await database.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Iniciar sesión
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await database.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id;
            req.session.username = user.username;

            return res.json({
                message: 'Inicio de sesión exitoso',
                user: { id: user.id, username: user.username }
            });
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// Obtener sesión
export const getSession = (req, res) => {
    if (req.session.userId) {
        return res.json({
            loggedIn: true,
            user: { id: req.session.userId, username: req.session.username }
        });
    } else {
        return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
    }
};

// Cerrar sesión
export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar la sesión' });
        }
        res.clearCookie('connect.sid');
        return res.json({ message: 'Sesión cerrada exitosamente' });
    });
};