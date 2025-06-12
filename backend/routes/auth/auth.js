// keycloak/auth.js
const axios = require('axios');

async function login(username, password) {
  const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
  const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'master';

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
