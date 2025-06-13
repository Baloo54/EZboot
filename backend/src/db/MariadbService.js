// --- mariadb/MariadbService.js ---
import pool from '../db/MariadbConnection.js';
import bcrypt from 'bcrypt';

export default {
  // Crée un nouvel utilisateur (avec mot de passe haché)
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

  // Supprime un utilisateur par son nom d'utilisateur
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

  // Vérifie le login (username + mot de passe en clair)
  async authenticateUser(username, plainPassword) {
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

      if (match) {
        return { success: true, userId: user.id };
      } else {
        return { success: false, message: 'Mot de passe incorrect' };
      }
    } catch (error) {
      console.error('Erreur d\'authentification :', error);
      return { success: false, error: error.message };
    }
  }
};
