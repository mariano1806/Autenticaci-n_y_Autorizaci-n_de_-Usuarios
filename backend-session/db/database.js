import mysql from 'mysql2/promise';

export const database = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'db_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

