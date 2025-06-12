import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());


app.get('/api', (req, res) => {
    res.json({ message: 'API EZBoot fonctionne !' });
});


const port = 3001;
app.listen(port, () => {
    console.log(`Serveur backend lancé sur le port ${port}`);
});
