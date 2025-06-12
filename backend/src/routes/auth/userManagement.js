// keycloak/userManagement.js
const axios = require('axios');
const { getAdminToken } = require('./adminToken');

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'master';

async function createUser({ username, password, email }) {
  const token = await getAdminToken();
  const user = {
    username,
    enabled: true,
    credentials: [{ type: 'password', value: password, temporary: false }],
    email,
  };
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
    return { success: true, status: res.status };
  } catch (e) {
    if (e.response && e.response.status === 409) {
      return { success: false, message: 'Utilisateur déjà existant' };
    }
    return { success: false, message: e.response ? e.response.data : e.message };
  }
}

async function deleteUserByUsername(username) {
  const token = await getAdminToken();
  // 1. Chercher l'utilisateur
  const searchRes = await axios.get(
    `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users?username=${encodeURIComponent(username)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!searchRes.data || searchRes.data.length === 0) {
    return { success: false, message: "Utilisateur introuvable" };
  }
  const userId = searchRes.data[0].id;
  // 2. Supprimer l'utilisateur
  await axios.delete(
    `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return { success: true };
}

module.exports = { createUser, deleteUserByUsername };
