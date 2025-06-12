// keycloak/auth.js
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

async function login(username, password) {
  const KEYCLOAK_REALM = readSecret('/run/secrets/keycloak_realm', process.env.KEYCLOAK_REALM);
  const KEYCLOAK_URL = readSecret('/run/secrets/keycloak_url', process.env.KEYCLOAK_URL);

  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', 'account');
  params.append('username', username);
  params.append('password', password);

  try {
    const res = await axios.post(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    return { success: true, data: res.data };
  } catch (e) {
    return { success: false, message: e.response ? e.response.data : e.message };
  }
}

module.exports = { login };
