// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://127.0.0.1:80/auth',  
  realm: 'ezboot',                     
  clientId: 'frontend',                  
});

export default keycloak;
