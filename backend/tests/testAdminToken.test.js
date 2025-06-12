const axios = require('axios');
const fs = require('fs');
const { getAdminToken } = require('../src/routes/auth/adminToken.js');

// On mock axios et fs
jest.mock('axios');
jest.mock('fs');

function resetEnv() {
  jest.clearAllMocks();
  process.env.KEYCLOAK_REALM = undefined;
  process.env.KEYCLOAK_URL = undefined;
  process.env.KEYCLOAK_ADMIN = undefined;
  process.env.KEYCLOAK_ADMIN_PASSWORD = undefined;
}

describe('getAdminToken (secrets + env)', () => {
  beforeEach(() => {
    resetEnv();
  });

  it('lit tous les credentials via les secrets si présents', async () => {
    fs.existsSync.mockImplementation((path) =>
      [
        '/run/secrets/keycloak_realm',
        '/run/secrets/keycloak_url',
        '/run/secrets/keycloak_admin',
        '/run/secrets/keycloak_admin_password'
      ].includes(path)
    );
    fs.readFileSync.mockImplementation((path) => {
      if (path === '/run/secrets/keycloak_realm') return 'realmtest\n';
      if (path === '/run/secrets/keycloak_url') return 'http://keycloak:8080\n';
      if (path === '/run/secrets/keycloak_admin') return 'superuser\n';
      if (path === '/run/secrets/keycloak_admin_password') return 'ultrasecret\n';
      return '';
    });

    axios.post.mockResolvedValue({ data: { access_token: 'token42' } });

    const token = await getAdminToken();

    expect(token).toBe('token42');
    expect(fs.readFileSync).toHaveBeenCalledWith('/run/secrets/keycloak_realm', 'utf8');
    expect(fs.readFileSync).toHaveBeenCalledWith('/run/secrets/keycloak_url', 'utf8');
    expect(fs.readFileSync).toHaveBeenCalledWith('/run/secrets/keycloak_admin', 'utf8');
    expect(fs.readFileSync).toHaveBeenCalledWith('/run/secrets/keycloak_admin_password', 'utf8');
    expect(axios.post).toHaveBeenCalledWith(
      'http://keycloak:8080/realms/realmtest/protocol/openid-connect/token',
      expect.any(URLSearchParams),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  });

  it('lit les credentials via variables d\'environnement si secrets absents', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.KEYCLOAK_REALM = 'realmenv';
    process.env.KEYCLOAK_URL = 'http://env-keycloak:8080';
    process.env.KEYCLOAK_ADMIN = 'admin_env';
    process.env.KEYCLOAK_ADMIN_PASSWORD = 'pwd_env';

    axios.post.mockResolvedValue({ data: { access_token: 'token_env' } });

    const token = await getAdminToken();

    expect(token).toBe('token_env');
    expect(axios.post).toHaveBeenCalledWith(
      'http://env-keycloak:8080/realms/realmenv/protocol/openid-connect/token',
      expect.any(URLSearchParams),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  });

  it('utilise les valeurs de fallback si ni secret ni variable d\'env ne sont présents', async () => {
    fs.existsSync.mockReturnValue(false);
    // On laisse toutes les vars d'env undefined => le code va utiliser ''
    axios.post.mockResolvedValue({ data: { access_token: 'token_fallback' } });

    const token = await getAdminToken();

    // ICI: la requête part sur /realms//protocol... etc.
    expect(token).toBe('token_fallback');
    expect(axios.post).toHaveBeenCalled();
  });
});
