import { SecurityHeaders, CorsOptions } from './midleware/SecurityHeaders.js';
import { cookieParserMiddleware, csrfProtection, sendCsrfToken } from './midleware/Crsf.js';
import keycloakAuthRoutes from './routes/keycloakAuthRoutes.js';
import express from 'express';

// 🔐 Sécurité
app.use(SecurityHeaders);
app.use(cookieParserMiddleware);
app.use(CorsOptions);

// 📦 Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔐 CSRF
app.use(csrfProtection);
app.get('/api/csrf-token', sendCsrfToken);

// 📁 Routes
const app = express();
app.use(express.json());
app.use('/api/keycloak', keycloakAuthRoutes()); 


const port = 3000;
app.listen(port, () => {
    console.log(`Serveur backend lancé sur le port ${port}`);
});
