// Pas besoin de require('dotenv').config(); dans Docker, mais on peut le laisser pour usage local
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(cors());

// SUPPRIME ces lignes inutiles (elles ne servent à rien dans ton cas et polluent les logs)
// const ENV = process.env.ENV;
// const DB = process.env.DB;

// console.log("ENV:", ENV);
// console.log("DB:", DB);

// On affiche les variables vraiment utiles pour debug
console.log("MARIADB_HOST:", process.env.MARIADB_HOST);
console.log("MARIADB_DATABASE:", process.env.MARIADB_DATABASE);

let config = {};
try {
    config = JSON.parse(fs.readFileSync('./config.json'));
} catch (e) {
    // Pas bloquant si le fichier n'existe pas
    console.error("Erreur lors de la lecture du fichier de configuration :", e.message);
}

let mariadbConfig = {
    host: process.env.MARIADB_HOST || config.MARIADB_HOST || 'localhost',
    user: process.env.MARIADB_USER || config.MARIADB_USER || 'root',
    password: process.env.MARIADB_PASSWORD || config.MARIADB_PASSWORD || '',
    database: process.env.MARIADB_DATABASE || config.MARIADB_DATABASE || '',
    port: process.env.MARIADB_PORT || config.MARIADB_PORT || 3306
};

console.log("Configuration MariaDB :", mariadbConfig);

app.get('/api', (req, res) => {
    res.json({message: 'API EZBoot fonctionne !'});
});

app.get('/api/dbtest', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(mariadbConfig);
        const [rows] = await connection.query('SELECT 1');
        res.json({success: true, result: rows});
    } catch (e) {
        res.status(500).json({success: false, message: e.message});
    } finally {
        if(connection) await connection.end();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur backend lancé sur le port ${port}`);
});
