# EZboot

EZboot est une application web de gestion d’images systèmes (ISO), offrant une plateforme sécurisée pour télécharger et gérer des fichiers ISO avec authentification utilisateur.

🚀 Fonctionnalités :

    Gestion des utilisateurs : Authentification sécurisée via Keycloak

    Téléchargement d’images OS : Prise en charge des fichiers ISO Ubuntu, Debian et Fedora

    Architecture microservices : Services conteneurisés avec Docker

    Sécurité : Protection CSRF, en-têtes HTTP sécurisés et authentification OAuth2


📦 Architecture :

EZboot repose sur une architecture microservices moderne :

    Frontend : Application React + Vite avec Material UI

    Backend : API REST Express.js

    Authentification : Fournie par Keycloak

    Base de données : MariaDB

    Serveur web : Nginx en reverse proxy

🔧 Installation et mise en place
Prérequis :

    Docker et Docker Compose

    Node.js (pour le développement local)

Installation :

    Cloner le dépôt :

git clone <url-du-dépôt>
cd EZboot

Créer le dossier secrets avec les identifiants requis :

mkdir -p secrets

Ajouter les fichiers secrets suivants dans le dossier secrets :

    KEYCLOAK_ADMIN

    KEYCLOAK_ADMIN_PASSWORD

    KEYCLOAK_REALM

    KEYCLOAK_URL

    MARIADB_DATABASE

    MARIADB_HOST

    MARIADB_PASSWORD

    MARIADB_ROOT_PASSWORD

    MARIADB_USER

Construire et démarrer les services :

    docker-compose up -d --build

    Accéder à l’application sur : http://localhost:80

🧪 Développement et tests

Développement backend :

cd backend
npm install
npm test

Développement frontend

cd frontend
npm install
npm run dev

📊 Structure du projet :

├── backend/              # API backend Express.js
│   ├── src/              # Code source
│   │   ├── db/           # Connexion à la base de données
│   │   ├── keycloak/     # Intégration Keycloak
│   │   ├── middleware/   # Middleware Express
│   │   └── routes/       # Routes de l’API
│   └── tests/            # Fichiers de test Jest
├── dockerfile/           # Configuration Docker
│   ├── keycloak/         # Configuration Keycloak
│   └── nginx/            # Configuration Nginx
├── frontend/             # Application frontend React
│   └── src/              # Code source
└── secrets/              # Identifiants secrets (non versionnés)

🛡️ Sécurité

EZboot met en œuvre plusieurs mesures de sécurité :

    Authentification OAuth2 avec Keycloak

    Protection contre les attaques CSRF

    En-têtes HTTP sécurisés avec Helmet

    Conteneurs Docker non-root

    Gestion sécurisée des secrets

🧰 Technologies :

    Frontend : React, Material UI, React Router, Keycloak JS

    Backend : Express.js, JWT, Axios

    Infrastructure : Docker, Nginx

    Base de données : MariaDB

    Tests : Jest, Supertest

    CI/CD : GitHub Actions

👥 Contributeurs :

    Gabriel Compte

    Thomas Fuchs
