// --- mariadb/MariadbService.js ---
import pool from '../db/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { readSecret } from '../utils/ReadSecrets.js';

const JWT_SECRET = readSecret('jwt_secret');
const JWT_EXPIRES_IN = '1h';

const MariadbService = {
  async createUser(username, plainPassword) {
    try {
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const [result] = await pool.execute(
        'INSERT INTO utilisateur (username, password) VALUES (?, ?)',
        [username, hashedPassword]
      );
      return { success: true, userId: result.insertId };
    } catch (error) {
      console.error('Erreur création utilisateur :', error);
      return { success: false, error: error.message };
    }
  },

  async deleteUser(username) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM utilisateur WHERE username = ?',
        [username]
      );
      return { success: result.affectedRows > 0 };
    } catch (error) {
      console.error('Erreur suppression utilisateur :', error);
      return { success: false, error: error.message };
    }
  },

  // Authentifie et retourne un token JWT
  async loginAndGetToken(username, plainPassword) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM utilisateur WHERE username = ?',
        [username]
      );

      if (rows.length === 0) {
        return { success: false, message: 'Utilisateur non trouvé' };
      }

      const user = rows[0];
      const match = await bcrypt.compare(plainPassword, user.password);
      if (!match) {
        return { success: false, message: 'Mot de passe incorrect' };
      }

      // Génération du token JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return { success: true, token };
    } catch (error) {
      console.error('Erreur login :', error);
      return { success: false, error: error.message };
    }
  },

  // Middleware Express de vérification JWT
  verifyTokenMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Format de token invalide' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token invalide', error: err.message });
      }
      req.user = decoded;
      next();
    });
  }
};

export default MariadbService;
