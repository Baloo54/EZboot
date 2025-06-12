const express = require('express');
const { login } = require('./auth'); // Chemin selon ton arbo
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await login(username, password);
  if (result.success) {
    // Création de la session ici !
    req.session.user = {
      username,
      // Si tu veux, tu peux stocker le token aussi :
      // token: result.data.access_token
    };
    res.json({ message: 'Connecté', username });
  } else {
    res.status(401).json({ error: 'Mauvais identifiants' });
  }
});

module.exports = router;
