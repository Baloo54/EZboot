// --- db/config.js ---
import mysql from 'mysql2/promise';
import { readSecret } from '../utils/ReadSecrets.js';

const mariadbConfig = {
  host: 'mariadb',
  user: readSecret('mariadb_user'),
  password: readSecret('mariadb_password'),
  database: readSecret('mariadb_database'),
  port: 3306,
};

const pool = mysql.createPool(mariadbConfig);

export default pool;
