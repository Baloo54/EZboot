const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.post('/api/echo', (req, res) => {
  res.json({ youSent: req.body });
});

module.exports = app;