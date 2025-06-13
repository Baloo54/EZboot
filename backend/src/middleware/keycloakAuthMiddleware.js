import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// URL pour récupérer la clé publique JWKS Keycloak (à adapter)
const KEYCLOAK_URL = 'http://keycloak:8080';
const REALM = 'ezboot';

// Endpoint JWKS de Keycloak (exemple)
const jwksUri = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`;

// Création du client JWKS
const client = jwksClient({
  jwksUri,
  cache: true,            // cache les clés pour performance
  cacheMaxEntries: 5,     
  cacheMaxAge: 10 * 60 * 1000, // cache 10 min
});

/**
 * Récupère la clé publique correspondant au kid dans le token
 */
function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

/**
 * Middleware Express pour vérifier le token JWT Keycloak
 */
function keycloakAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  // Vérification du token avec la clé publique récupérée via JWKS
  jwt.verify(token, getKey, {
    audience: 'backend',     
    issuer: `${KEYCLOAK_URL}/realms/${REALM}`, // vérifier l’émetteur
    algorithms: ['RS256'],        // Keycloak signe en RS256
  }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }
    // Token valide
    req.user = decoded; // tu peux récupérer l'utilisateur ici
    next();
  });
}

export default keycloakAuthMiddleware;
