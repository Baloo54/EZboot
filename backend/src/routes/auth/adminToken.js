// keycloak/adminToken.js
import axios from 'axios';
import { readFileSync, existsSync } from 'fs';

function readSecret(path, fallback = '') {
  try {
    if (existsSync(path)) {
      return readFileSync(path, 'utf8').trim();
    }
  } catch (e) {
    // tu peux logger ou ignorer
  }
  return fallback;
}

async function getAdminToken() {
  const KEYCLOAK_REALM = readSecret('/run/secrets/keycloak_realm', process.env.KEYCLOAK_REALM);
  const KEYCLOAK_URL = readSecret('/run/secrets/keycloak_url', process.env.KEYCLOAK_URL);
  const KEYCLOAK_ADMIN = readSecret('/run/secrets/keycloak_admin', process.env.KEYCLOAK_ADMIN);
  const KEYCLOAK_ADMIN_PASSWORD = readSecret('/run/secrets/keycloak_admin_password', process.env.KEYCLOAK_ADMIN_PASSWORD);

  

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', 'admin-cli');
  params.append('username', KEYCLOAK_ADMIN);
  params.append('password', KEYCLOAK_ADMIN_PASSWORD);

  const res = await axios.post(
    `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return res.data.access_token;
}

module.exports = { getAdminToken };
