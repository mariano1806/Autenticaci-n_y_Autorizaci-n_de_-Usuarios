import { createPool } from 'mysql2/promise';

export const database = async () => {
    try {
        const pool = createPool({
            host: 'localhost', // Usa 127.0.0.1 para IPv4
            user: 'root',
            database: 'db_system',
            port: 3306, // Asegúrate de que el puerto sea 3306
            connectionLimit: 20
        });
        console.log('Conexión exitosa a la base de datos');
        return pool;
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw new Error('Error al conectar con la base de datos');
    }
};
