import React, { useState } from 'react';

function App() {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  const register = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/mariadb/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerUsername,
          password: registerPassword
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Compte créé avec succès !');
      } else {
        setMessage(`Erreur: ${data.message}`);
      }
    } catch (error) {
      setMessage('Erreur lors de la création du compte.');
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/mariadb/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setMessage('Connexion réussie !');
      } else {
        setMessage(`Erreur: ${data.message}`);
      }
    } catch (error) {
      setMessage('Erreur lors de la connexion.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>MariaDB Authentification</h1>

      <form onSubmit={register} style={{ marginBottom: '2rem' }}>
        <h2>Créer un compte</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={registerUsername}
          onChange={(e) => setRegisterUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Mot de passe"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">S'inscrire</button>
      </form>

      <form onSubmit={login}>
        <h2>Se connecter</h2>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Mot de passe"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Se connecter</button>
      </form>

      {message && <p style={{ color: message.includes('Erreur') ? 'red' : 'green' }}>{message}</p>}

      {token && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Token JWT :</h3>
          <textarea value={token} readOnly style={{ width: '100%', height: '100px' }} />
        </div>
      )}
    </div>
  );
}

export default App;
