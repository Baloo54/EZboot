import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web';
import keycloak from './components/Keycloak.jsx';
import RegisterForm from './components/RegisterForm.jsx';

function AppContent() {
  const { keycloak, initialized } = useKeycloak();

  if (initialized) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {!keycloak.authenticated ? (
        <>
          <button onClick={() => keycloak.login()}>Se connecter avec Keycloak</button>
          <br />
          <Link to="/inscription">Créer un compte</Link>
        </>
      ) : (
        <>
          <h1>Bienvenue {keycloak.tokenParsed.preferred_username}</h1>
          <button onClick={() => keycloak.logout()}>Se déconnecter</button>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/inscription" element={<RegisterForm />} />
        </Routes>
      </Router>
    </ReactKeycloakProvider>
  );
}

export default App;
