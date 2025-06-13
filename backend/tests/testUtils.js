import express from 'express';
import createKeycloakAuthRouter from '../src/routes/keycloakAuthRoutes.js';

// Middleware factice pour tests (pass-through)
const mockAuthMiddleware = (req, res, next) => next();

export function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/keycloak', createKeycloakAuthRouter(mockAuthMiddleware)); // injecte le middleware factice
  return app;
}
