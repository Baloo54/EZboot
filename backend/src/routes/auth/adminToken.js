// keycloak/adminToken.js
const axios = require('axios');

async function getAdminToken() {
  const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
  const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'master';
  const KEYCLOAK_ADMIN = process.env.KEYCLOAK_ADMIN || 'admin';
  const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';

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
