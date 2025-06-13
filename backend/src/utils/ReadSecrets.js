import fs from 'fs';

function readSecret(name) {
  try {
    return fs.readFileSync('/run/secrets/'+name, 'utf8').trim();
  } catch {
    return console.warn(`Secret ${name} not found, returning empty string.`);
  }
}

export default readSecret;