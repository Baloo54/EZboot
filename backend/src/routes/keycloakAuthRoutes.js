import express from 'express';
import { createUser, deleteUserByUsername } from '../keycloak/KeycloakService.js';
import keycloakAuthMiddleware from '../middleware/keycloakAuthMiddleware.js';

/**
 * Crée un routeur Express pour gérer les utilisateurs Keycloak.
 * 
 * @param {function} [authMiddleware=keycloakAuthMiddleware] Middleware d’authentification à appliquer
 *                                                    sur les routes protégées (par défaut keycloakAuthMiddleware).
 * @returns {express.Router} Routeur configuré avec les routes de gestion des utilisateurs Keycloak.
 */
function createKeycloakAuthRouter(authMiddleware = keycloakAuthMiddleware) {
  const router = express.Router();

  /**
   * @route POST /users
   * @desc Crée un nouvel utilisateur Keycloak avec les informations fournies.
   * @access Public (peut être protégé par un middleware au besoin).
   * 
   * @body {string} username - Nom d’utilisateur requis.
   * @body {string} password - Mot de passe requis.
   * @body {string} email - Adresse email requise.
   * 
   * @returns {object} JSON avec le résultat de la création :
   *   - 201 : succès avec message "Utilisateur créé."
   *   - 400 : erreur si des champs sont manquants.
   *   - 409 : conflit si l’utilisateur existe déjà.
   *   - 500 : erreur serveur en cas de problème inattendu.
   */
  router.post('/users', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: 'Champs manquants : username, password, email requis.' });
    }

    try {
      const result = await createUser({ username, password, email });
      if (!result.success) {
        return res.status(409).json({ success: false, message: result.message });
      }
      return res.status(201).json({ success: true, message: 'Utilisateur créé.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur lors de la création de l’utilisateur.', error });
    }
  });

  /**
   * @route DELETE /users/:username
   * @desc Supprime un utilisateur Keycloak par son nom d’utilisateur.
   * @access Protégé par un middleware d’authentification (par défaut keycloakAuthMiddleware).
   * 
   * @param {string} username - Nom d’utilisateur à supprimer (paramètre d’URL).
   * 
   * @returns {object} JSON avec le résultat de la suppression :
   *   - 200 : succès avec message "Utilisateur supprimé."
   *   - 404 : utilisateur non trouvé.
   *   - 500 : erreur serveur en cas de problème inattendu.
   */
  router.delete('/users/:username', authMiddleware, async (req, res) => {
    const { username } = req.params;
    try {
      const result = await deleteUserByUsername(username);
      if (!result.success) {
        return res.status(404).json({ success: false, message: result.message });
      }
      return res.status(200).json({ success: true, message: 'Utilisateur supprimé.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l’utilisateur.', error });
    }
  });

  return router;
}

export default createKeycloakAuthRouter;
