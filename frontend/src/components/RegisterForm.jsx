// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/keycloak/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage(data.message);
        setForm({ username: '', email: '', password: '' });
      } else {
        setSuccess(false);
        setMessage(data.message);
      }
    } catch (err) {
      setSuccess(false);
      setMessage("Erreur réseau ou serveur.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" gutterBottom>Inscription</Typography>
      {message && (
        <Alert severity={success ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom d'utilisateur"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          type="email"
        />
        <TextField
          label="Mot de passe"
          name="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          type="password"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          S'inscrire
        </Button>
      </form>
    </Box>
  );
};

export default RegisterForm;
