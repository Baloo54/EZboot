const axios = require('axios');
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'master';
const KEYCLOAK_ADMIN = process.env.KEYCLOAK_ADMIN || 'admin';
const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin';
// Utilisateur à créer
const user = {
  username: 'testuser',
  enabled: true,
  credentials: [{ type: 'password', value: 'testpassword', temporary: false }],
  email: 'testuser@example.com'
};

// Fonction pour obtenir le token admin
async function getAdminToken() {
  try {
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
  } catch (e) {
    throw new Error('Impossible de récupérer le token admin : ' + (e.response ? JSON.stringify(e.response.data) : e.message));
  }
}

async function createUser(token) {
  try {
    const res = await axios.post(
      `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users`,
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Utilisateur créé !', res.status);
  } catch (e) {
    if (e.response && e.response.status === 409) {
      console.error('Utilisateur déjà existant');
    } else {
      console.error('Erreur lors de la création de l\'utilisateur :', e.response ? e.response.data : e.message);
    }
  }
}

(async () => {
  try {
    const token = await getAdminToken();
    await createUser(token);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
