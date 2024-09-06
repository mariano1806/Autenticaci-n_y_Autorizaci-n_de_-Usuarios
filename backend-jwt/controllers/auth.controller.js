import bcrypt from 'bcrypt';
import { database } from '../db/database.js';
import {generarJwt} from '../helpers/generar-jwt.js';

export const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Obtener la conexión del pool
        const pool = await database();

        // Verificar si el usuario ya existe
        const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        console.log(rows);

        if (rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Cifrar la contraseña antes de almacenarla
        /* const hashedPassword = await bcrypt.hash(password, 10);
 */
        // Crear el usuario
        await pool.execute(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );

        return res.json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en la conexión a la base de datos:', error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    console.log(username, password);

    try {
        // Obtener la conexión del pool
        const pool = await database();

        // Buscar el usuario en la base de datos
        const [[user]] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        console.log(user)

        // Generar token JWT
        const token = await generarJwt(user.id);
        // Guardar el token en la sesión
        req.session.token = token;

        // Enviar el token en una cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, 
            maxAge: 18000000 
        });

        return res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error en la conexión a la base de datos:', error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};

export const session = (req, res) => {
        console.log(req.user);
        return res.json({ message: 'Acceso permitido a área protegida', user: req.user });
};

export const logout = (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }

            res.clearCookie('authToken');
            return res.json({ message: 'Cierre de sesión exitoso' });
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};