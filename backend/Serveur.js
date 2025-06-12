if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { getConnection } = require('./db/MariadbConnection');

const app = express();

app.use(express.json());
app.use(cors());

console.log("MARIADB_HOST:", process.env.MARIADB_HOST);
console.log("MARIADB_DATABASE:", process.env.MARIADB_DATABASE);

app.get('/api', (req, res) => {
    res.json({ message: 'API EZBoot fonctionne !' });
});

app.get('/api/dbtest', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.query('SELECT 1');
        res.json({ success: true, result: rows });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    } finally {
        if (connection) await connection.end();
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur backend lancé sur le port ${port}`);
});
