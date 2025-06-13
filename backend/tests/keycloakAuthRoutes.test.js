import request from 'supertest';
import { createTestApp, mockAuthMiddleware } from './testUtils.js';
import * as keycloakService from '../src/keycloak/KeycloakService.js';

jest.mock('../src/keycloak/KeycloakService.js');

describe('Keycloak Auth Routes', () => {
  let app;

  beforeEach(() => {
    // Utilise le middleware mock pour bypasser l'auth en test
    app = createTestApp(mockAuthMiddleware);
  });

  describe('POST /api/keycloak/users', () => {
    it('doit créer un utilisateur avec succès', async () => {
      keycloakService.createUser.mockResolvedValue({ success: true });

      const res = await request(app)
        .post('/api/keycloak/users')
        .send({ username: 'testuser', password: 'pass123', email: 'test@example.com' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('doit renvoyer une erreur si des champs sont manquants', async () => {
      const res = await request(app)
        .post('/api/keycloak/users')
        .send({ username: 'testuser', password: 'pass123' }); // email manquant

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('doit renvoyer un conflit si l’utilisateur existe déjà', async () => {
      keycloakService.createUser.mockResolvedValue({ success: false, message: 'Utilisateur déjà existant' });

      const res = await request(app)
        .post('/api/keycloak/users')
        .send({ username: 'existinguser', password: 'pass', email: 'existing@example.com' });

      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Utilisateur déjà existant');
    });
  });

  describe('DELETE /api/keycloak/users/:username', () => {
    it('doit supprimer un utilisateur avec succès', async () => {
      keycloakService.deleteUserByUsername.mockResolvedValue({ success: true });

      const res = await request(app).delete('/api/keycloak/users/testuser');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('doit renvoyer une erreur si l’utilisateur est introuvable', async () => {
      keycloakService.deleteUserByUsername.mockResolvedValue({ success: false, message: 'Utilisateur introuvable' });

      const res = await request(app).delete('/api/keycloak/users/inconnu');
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Utilisateur introuvable');
    });
  });
});
