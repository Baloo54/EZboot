import axios from 'axios';
import fs from 'fs';
const adminTokenModule = require('../src/routes/auth/adminToken.js');

// IMPORTANT: on doit d'abord mocker le module dépendant AVANT d'importer ce qu'on veut tester !
jest.mock('axios');
jest.mock('fs');
jest.mock('../src/routes/auth/adminToken.js', () => ({
  getAdminToken: jest.fn(),
}));

const { createUser, deleteUserByUsername } = require('../src/routes/auth/userManagement.js');

describe('userManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.KEYCLOAK_REALM = undefined;
    process.env.KEYCLOAK_URL = undefined;
  });

  it('createUser : success', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.KEYCLOAK_REALM = 'realm';
    process.env.KEYCLOAK_URL = 'http://keycloak';

    adminTokenModule.getAdminToken.mockResolvedValue('admin-token');
    axios.post.mockResolvedValue({ status: 201 });

    const result = await createUser({
      username: 'bob',
      password: 'secret',
      email: 'bob@mail.com',
    });

    expect(adminTokenModule.getAdminToken).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      'http://keycloak/admin/realms/realm/users',
      {
        username: 'bob',
        enabled: true,
        credentials: [{ type: 'password', value: 'secret', temporary: false }],
        email: 'bob@mail.com',
      },
      {
        headers: {
          Authorization: 'Bearer admin-token',
          'Content-Type': 'application/json'
        }
      }
    );
    expect(result).toEqual({ success: true, status: 201 });
  });

  it('createUser : utilisateur déjà existant (409)', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.KEYCLOAK_REALM = 'realm';
    process.env.KEYCLOAK_URL = 'http://keycloak';

    adminTokenModule.getAdminToken.mockResolvedValue('admin-token');
    axios.post.mockRejectedValue({ response: { status: 409 } });

    const result = await createUser({
      username: 'bob',
      password: 'secret',
      email: 'bob@mail.com',
    });

    expect(result).toEqual({ success: false, message: 'Utilisateur déjà existant' });
  });

  it('createUser : erreur API Keycloak', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.KEYCLOAK_REALM = 'realm';
    process.env.KEYCLOAK_URL = 'http://keycloak';

    adminTokenModule.getAdminToken.mockResolvedValue('admin-token');
    axios.post.mockRejectedValue({ response: { data: 'Erreur inconnue' } });

    const result = await createUser({
      username: 'alice',
      password: 'pass',
      email: 'alice@mail.com',
    });

    expect(result).toEqual({ success: false, message: 'Erreur inconnue' });
  });

  it('deleteUserByUsername : succès', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.KEYCLOAK_REALM = 'realm';
    process.env.KEYCLOAK_URL = 'http://keycloak';

    adminTokenModule.getAdminToken.mockResolvedValue('admin-token');
    // Simule la recherche d'utilisateur
    axios.get.mockResolvedValue({ data: [{ id: 'user-id' }] });
    axios.delete.mockResolvedValue({});

    const result = await deleteUserByUsername('bob');

    expect(axios.get).toHaveBeenCalledWith(
      'http://keycloak/admin/realms/realm/users?username=bob',
      { headers: { Authorization: 'Bearer admin-token' } }
    );
    expect(axios.delete).toHaveBeenCalledWith(
      'http://keycloak/admin/realms/realm/users/user-id',
      { headers: { Authorization: 'Bearer admin-token' } }
    );
    expect(result).toEqual({ success: true });
  });

  it('deleteUserByUsername : utilisateur introuvable', async () => {
    fs.existsSync.mockReturnValue(false);
    process.env.KEYCLOAK_REALM = 'realm';
    process.env.KEYCLOAK_URL = 'http://keycloak';

    adminTokenModule.getAdminToken.mockResolvedValue('admin-token');
    axios.get.mockResolvedValue({ data: [] });

    const result = await deleteUserByUsername('notfound');
    expect(result).toEqual({ success: false, message: "Utilisateur introuvable" });
  });
});
