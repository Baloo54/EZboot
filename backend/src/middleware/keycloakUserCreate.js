//admin token
//page gérer les création d'utilisateur
//gérer la connexion des comptes
//supprimer les utilisateurs

// keycloak/index.js
const { createUser, deleteUserByUsername } = require('./userManagement');
const { login } = require('./auth');

// Créer un utilisateur
// (async () => {
//   const res = await createUser({ username: "testuser", password: "testpassword", email: "testuser@example.com" });
//   console.log(res);
// })();

// Se connecter
// (async () => {
//   const res = await login("testuser", "testpassword");
//   console.log(res);
// })();

// Supprimer un utilisateur
// (async () => {
//   const res = await deleteUserByUsername("testuser");
//   console.log(res);
// })();
