FROM node:lts

# Définit le dossier de travail et change les droits
WORKDIR /app

# Copie les fichiers de configuration et les tests
COPY package*.json Server.js ./  
COPY src ./src  
COPY tests ./tests

# Installe les dépendances de production  
# RUN npm install --production
RUN npm install \
    && useradd --system --home-dir /app --create-home appuser \
    && chown -R appuser:appuser /app


#Execute le serveur en tant qu'utilisateur non root

USER appuser

# Expose le port 3000

EXPOSE 3000

# Démarre le serveur
CMD ["npm", "start"]
