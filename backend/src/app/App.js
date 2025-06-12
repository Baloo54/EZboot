import express from 'express';
import authRouter from './src/routes/auth/authRouter'; 
const app = express();


app.use(session({
  secret: process.env.SESSION_SECRET || 'vraiment-un-secret-unique-à-changer', // à sécuriser en prod !
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true si tu es en HTTPS uniquement
}));


app.post('/api/login', async (req, res) => {
  // Supposons que tu as une fonction loginKeycloak qui fait l'authentification
  const { username, password } = req.body;
  const result = await loginKeycloak(username, password);
  if (result.success) {
    req.session.user = { username };
    res.json({ message: 'Connecté' });
  } else {
    res.status(401).json({ error: 'Mauvais identifiants' });
  }
});


function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.status(401).json({ error: 'Non connecté' });
}

app.get('/api/achat', isAuthenticated, (req, res) => {
  res.json({ message: "Achat OK" });
});


app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Déconnecté" });
  });
});

app.use('/api', authRouter);

app.listen(3001, () => console.log('Serveur sur 3001'));


app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.post('/api/echo', (req, res) => {
  res.json({ youSent: req.body });
});

module.exports = app;
