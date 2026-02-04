FROM nginx:alpine

# Remover config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copiar config customizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos do frontend
COPY . /usr/share/nginx/html

# Remover arquivos desnecessários do container
RUN rm -rf /usr/share/nginx/html/backend \
    /usr/share/nginx/html/node_modules \
    /usr/share/nginx/html/.git \
    /usr/share/nginx/html/.agent \
    /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/nginx.conf

# Expor porta
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1
