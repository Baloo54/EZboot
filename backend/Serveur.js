const fs = require('fs');
const dotenv = require('dotenv');

// 1. On charge les variables selon l'environnement
if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // Charge .env si en test/CI
} else {
  // En prod Swarm : lire les secrets dans /run/secrets/
  const secrets = ['DATABASE_URL', 'API_KEY'];
  for (const secret of secrets) {
    try {
      const value = fs.readFileSync(`/run/secrets/${secret}`, 'utf8');
      process.env[secret] = value.trim();
    } catch (err) {
      console.warn(`Secret ${secret} non trouvé`);
    }
  }
}

console.log("ENV:", process.env.NODE_ENV);
console.log("DB:", process.env.DATABASE_URL);