FROM nginx:alpine

# Copie les fichiers nécessaires AVANT de les manipuler
COPY entrypoint.sh /entrypoint.sh
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY ./html /usr/share/nginx/html

# Crée un utilisateur non-root et ajuste les permissions
RUN chmod +x /entrypoint.sh \
    && addgroup -g 1001 -S nginxgroup \
    && adduser -u 1001 -S nginxuser -G nginxgroup \
    && chown -R nginxuser:nginxgroup /etc/nginx /entrypoint.sh /var/cache/nginx /var/run /var/log/nginx \
    && mkdir -p /run && chown nginxuser:nginxgroup /run 

# Expose les ports HTTP et HTTPS
EXPOSE 80

# Utilise un utilisateur non-root
USER nginxuser

# Définition du point d'entrée et de la commande
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
