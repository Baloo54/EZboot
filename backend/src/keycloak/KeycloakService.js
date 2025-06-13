// keycloak/keycloakService.js

import axios from 'axios';
import { readSecret } from '../utils/ReadSecrets.js';

const KEYCLOAK_URL = 'http://keycloak:8080';
const KEYCLOAK_REALM = 'ezboot';

/**
 * Récupère un jeton d'accès administrateur à Keycloak.
 * Ce jeton est nécessaire pour les opérations sensibles (création/suppression d'utilisateurs).
 *
 * @async
 * @throws {Error} En cas d’échec de la requête HTTP vers Keycloak.
 * @returns {Promise<string>} Le jeton d’accès OAuth2.
 */
async function getAdminToken() {
  const KEYCLOAK_ADMIN = readSecret('keycloak_admin');
  const KEYCLOAK_ADMIN_PASSWORD = readSecret('keycloak_admin_password');

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

/**
 * Crée un nouvel utilisateur dans Keycloak.
 *
 * @async
 * @param {Object} params - Les informations de l'utilisateur.
 * @param {string} params.username - Le nom d'utilisateur à créer.
 * @param {string} params.password - Le mot de passe de l'utilisateur.
 * @param {string} params.email - L'adresse e-mail de l'utilisateur.
 * @returns {Promise<{ success: boolean, status?: number, message?: string }>}
 * Un objet indiquant le succès ou l’échec de la création.
 */
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
          'Content-Type': 'application/json',
        },
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

/**
 * Supprime un utilisateur Keycloak en le recherchant par son nom d’utilisateur.
 *
 * @async
 * @param {string} username - Le nom d'utilisateur à supprimer.
 * @returns {Promise<{ success: boolean, message?: string }>}
 * Résultat de l’opération, avec un message en cas d’échec.
 */
async function deleteUserByUsername(username) {
  const token = await getAdminToken();

  const searchRes = await axios.get(
    `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users?username=${encodeURIComponent(username)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!searchRes.data || searchRes.data.length === 0) {
    return { success: false, message: 'Utilisateur introuvable' };
  }

  const userId = searchRes.data[0].id;

  await axios.delete(
    `${KEYCLOAK_URL}/admin/realms/${KEYCLOAK_REALM}/users/${userId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return { success: true };
}

export { getAdminToken, createUser, deleteUserByUsername };
