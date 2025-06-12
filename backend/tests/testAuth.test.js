import axios from 'axios';
import fs from 'fs';
import { login } from '../src/routes/auth/auth.js'; 

jest.mock('axios');
jest.mock('fs');

describe('login (keycloak)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.KEYCLOAK_REALM = undefined;
    process.env.KEYCLOAK_URL = undefined;
  });

  it('lit les infos Keycloak via les secrets si présents', async () => {
    // On simule la présence des secrets
    fs.existsSync.mockImplementation((path) => 
      path === '/run/secrets/keycloak_realm' || path === '/run/secrets/keycloak_url'
    );
    fs.readFileSync.mockImplementation((path) => {
      if (path === '/run/secrets/keycloak_realm') return 'realmtest\n';
      if (path === '/run/secrets/keycloak_url') return 'http://keycloak:8080\n';
      return '';
    });

    axios.post.mockResolvedValue({ data: { access_token: 'token123' } });

    const result = await login('bob', 'secret');

    expect(fs.readFileSync).toHaveBeenCalledWith('/run/secrets/keycloak_realm', 'utf8');
    expect(fs.readFileSync).toHaveBeenCalledWith('/run/secrets/keycloak_url', 'utf8');
    expect(axios.post).toHaveBeenCalledWith(
      'http://keycloak:8080/realms/realmtest/protocol/openid-connect/token',
      expect.any(URLSearchParams),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    expect(result).toEqual({ success: true, data: { access_token: 'token123' } });
  });

  it('lit les infos Keycloak via variables d\'environnement si secrets absents', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.KEYCLOAK_REALM = 'realmenv';
    process.env.KEYCLOAK_URL = 'http://env-keycloak:8080';

    axios.post.mockResolvedValue({ data: { access_token: 'token_env' } });

    const result = await login('alice', 'envpass');

    expect(axios.post).toHaveBeenCalledWith(
      'http://env-keycloak:8080/realms/realmenv/protocol/openid-connect/token',
      expect.any(URLSearchParams),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    expect(result).toEqual({ success: true, data: { access_token: 'token_env' } });
  });

  it('retourne success: false et message en cas d\'erreur Keycloak avec data', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.KEYCLOAK_REALM = 'realm';
    process.env.KEYCLOAK_URL = 'http://keycloak';

    const errorResponse = { data: { error: 'invalid_grant' } };
    axios.post.mockRejectedValue({ response: errorResponse });

    const result = await login('bob', 'badpass');

    expect(result).toEqual({ success: false, message: errorResponse.data });
  });

  it('retourne success: false et message en cas d\'erreur réseau générique', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.KEYCLOAK_REALM = 'realm';
    process.env.KEYCLOAK_URL = 'http://keycloak';

    const errorMessage = 'Network Error';
    axios.post.mockRejectedValue(new Error(errorMessage));

    const result = await login('bob', 'badpass');

    expect(result).toEqual({ success: false, message: errorMessage });
  });
});
