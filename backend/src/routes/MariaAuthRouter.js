// --- routes/MariaAuthRouter.js ---
import express from 'express';
import MariadbService from '../db/MariadbService.js';

/**
 * Crée un routeur Express pour gérer les utilisateurs MariaDB avec authentification JWT.
 *
 * @param {function} [authMiddleware=MariadbService.verifyTokenMiddleware] 
 *        Middleware d’authentification à appliquer sur les routes protégées.
 * @returns {express.Router} Routeur configuré avec les routes de gestion des utilisateurs.
 */
function createMariaAuthRouter(authMiddleware = MariadbService.verifyTokenMiddleware) {
  const router = express.Router();

  /**
   * @route POST /users
   * @desc Crée un nouvel utilisateur MariaDB avec les informations fournies.
   * @access Public (peut être protégé si besoin).
   * 
   * @body {string} username - Nom d’utilisateur requis.
   * @body {string} password - Mot de passe requis.
   */
  router.post('/users', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Champs requis : username et password.' });
    }

    try {
      const result = await MariadbService.createUser(username, password);
      if (!result.success) {
        return res.status(409).json({ success: false, message: result.error || 'Utilisateur déjà existant.' });
      }
      return res.status(201).json({ success: true, message: 'Utilisateur créé.', userId: result.userId });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur lors de la création.', error });
    }
  });

  /**
   * @route DELETE /users/:username
   * @desc Supprime un utilisateur MariaDB par son nom d’utilisateur.
   * @access Protégé par JWT.
   */
  router.delete('/users/:username', authMiddleware, async (req, res) => {
    const { username } = req.params;
    try {
      const result = await MariadbService.deleteUser(username);
      if (!result.success) {
        return res.status(404).json({ success: false, message: result.error || 'Utilisateur non trouvé.' });
      }
      return res.status(200).json({ success: true, message: 'Utilisateur supprimé.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Erreur lors de la suppression.', error });
    }
  });

  /**
   * @route POST /login
   * @desc Authentifie l’utilisateur et renvoie un token JWT.
   * @access Public
   * 
   * @body {string} username - Nom d’utilisateur requis.
   * @body {string} password - Mot de passe requis.
   */
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Champs requis : username et password.' });
    }

    const result = await MariadbService.loginAndGetToken(username, password);
    if (!result.success) {
      return res.status(401).json({ success: false, message: result.message });
    }

    return res.status(200).json({ success: true, token: result.token });
  });

  return router;
}

export default createMariaAuthRouter;
