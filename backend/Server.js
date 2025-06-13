import express from 'express';
import { SecurityHeaders, CorsOptions } from './src/middleware/SecurityHeaders.js';
import keycloakAuthRoutes from './src/routes/MariaAuthRouter.js';

const app = express();

// 🔐 Sécurité
app.use(SecurityHeaders);
app.use(CorsOptions);

// 📦 Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📁 Routes
app.use('/api/keycloak', keycloakAuthRoutes()); 

const port = 3000;
app.listen(port, () => {
    console.log(`Serveur backend lancé sur le port ${port}`);
});
