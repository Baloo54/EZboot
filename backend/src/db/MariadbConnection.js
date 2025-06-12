// --- db/config.js ---
import mysql from 'mysql2/promise';
import fs from 'fs';

function readSecret(path, fallback = '') {
  try {
    return fs.readFileSync(path, 'utf8').trim();
  } catch {
    return fallback;
  }
}

const mariadbConfig = {
  host: process.env.MARIADB_HOST || 'mariadb', // nom du service docker ou localhost
  user: readSecret('/run/secrets/mariadb_user', 'root'),
  password: readSecret('/run/secrets/mariadb_password', ''),
  database: process.env.MARIADB_DATABASE || 'mydb',
  port: Number(process.env.MARIADB_PORT) || 3306,
};

const pool = mysql.createPool(mariadbConfig);

export default pool;
